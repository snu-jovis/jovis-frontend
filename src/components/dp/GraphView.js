import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import * as d3dag from "https://cdn.skypack.dev/d3-dag@1.0.0-1";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { parseDp } from "./parseDp";

const GraphView = ({ index, base, dp, selectedNodes, addNode, removeNode }) => {
  console.log("base", base, "dp", dp);
  const dagSvg = useRef(null);
  const svgWidth = 400;
  const svgHeight = 400;
  const margin = { x: 50, y: 50 };

  const [animation, setAnimation] = useState(false);
  const [showCostScale, setShowCostScale] = useState(false);

  var cheapestId = [];

  const handleClickPlay = () => {
    setAnimation((prev) => !prev);

    selectedNodes.forEach((node) => {
      removeNode(index, node.id);
    });
  };

  function generateNodeId(d) {
    return `${index} ${d.relid} - ${d.node}`.replace(/\s/g, "");
  }

  function drawGraph({ graphSvg, data }) {
    d3.select(graphSvg.current).selectAll("*").remove(); //clear

    // data graph 형태로 변경
    const graph = d3dag.graphStratify()(data);

    // coumpute layout
    let nodeSize = 50;
    const dagDepth = d3.max(data, (d) => d.level);
    const shape = d3dag.tweakShape([nodeSize, nodeSize], d3dag.shapeRect);

    const layout = d3dag
      .sugiyama()
      .nodeSize([nodeSize, nodeSize])
      .gap([nodeSize / 4, nodeSize])
      .tweaks([shape]);
    const { width: dagWidth, height: dagHeight } = layout(graph);
    const scale = Math.min(
      svgWidth / (dagWidth + margin.x * 2),
      svgHeight / (dagHeight + margin.y * 2)
    );

    const svg = d3
      .select(graphSvg.current)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr(
        "transform",
        `translate(${svgWidth - (svgWidth - dagWidth * scale) / 2}, ${
          svgHeight - margin.y
        }) scale(${scale}) rotate(180)`
      )
      .call(
        d3.zoom().on("zoom", (event) => {
          svg.attr("transform", event.transform);
        })
      )
      .append("g");

    // create nodes
    const nodes = svg
      .append("g")
      .selectAll("g")
      .data(graph.nodes())
      .enter()
      .append("g")
      .attr("transform", (d) => {
        return `translate(${d.x}, ${d.data.level * (dagHeight / dagDepth)})`;
      });

    const colorMap = new Map();
    const nodesArray = Array.from(graph.nodes());

    const nodeTypes = [
      ...new Set(
        nodesArray.map((node) => {
          return node.data.id.split(" - ")[1];
        })
      ),
    ];

    const colorSchemes = [...d3.schemePastel1, ...d3.schemePastel2];
    nodeTypes.forEach((type, i) => {
      colorMap.set(type, colorSchemes[i % 17]);
    });

    const costs = nodes
      .data()
      .map((d) =>
        d.data.nodeData
          ? d.data.nodeData.total_cost ||
            (d.data.nodeData.cheapest_total_paths
              ? d.data.nodeData.cheapest_total_paths.total_cost
              : 0)
          : 0
      );
    const minCost = d3.min(costs);
    const maxCost = d3.max(costs);

    // scale for node radius
    const costScale = d3
      .scaleLinear()
      .domain([minCost, maxCost])
      .range([40, 70]);

    nodes.each(function (d) {
      const node = d3.select(this);
      const parts = d.data.id.split(" - ");

      const targetSize =
        showCostScale && parts.length > 1
          ? costScale(
              d.data.nodeData.total_cost ||
                d.data.nodeData.cheapest_total_paths.total_cost
            )
          : 50;
      d.data.nodeSize = targetSize;

      if (parts.length > 1) {
        node
          .append("rect")
          .attr("id", (d) => `${index} ${d.data.id}`.replace(/\s/g, ""))
          .attr("width", targetSize)
          .attr("height", targetSize)
          .attr("x", -targetSize / 2)
          .attr("y", -targetSize / 2)
          .attr("fill", colorMap.get(parts[1]));
      } else {
        node
          .append("circle")
          .attr("r", targetSize / 2)
          .attr("fill", colorMap.get(nodeTypes[0]));
      }
    });

    // node type
    nodes
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("class", "dp-node-text")
      .attr("transform", `rotate(180)`)
      .each(function (d) {
        var lines;

        const type = d.data.id.split(" - ");
        if (type.length > 1) lines = type[1].split(/(?=[A-Z])/);
        else lines = type[0].split(" ");

        if (lines.length === 1) d3.select(this).text(lines[0]);
        else {
          for (let i = 0; i < lines.length; i++) {
            d3.select(this)
              .append("tspan")
              .text(lines[i])
              .attr("x", 0)
              .attr("dy", function () {
                if (lines.length > 2) return i ? "1em" : "-0.5em";
                else return i ? "1em" : "0em";
              });
          }
        }
      });

    nodes.on("click", function (event, d) {
      const rect = d3.select(this).select("rect");
      if (rect.empty()) return;

      const nodeId = d.data.id;
      const isSelected = rect.style("stroke") === "red";

      if (isSelected) {
        rect.style("stroke", null).style("stroke-width", null);
        removeNode(index, nodeId);
      } else {
        rect.style("stroke", "red").style("stroke-width", "2px");
        addNode(index, nodeId, d.data.nodeData);
      }
    });

    // create links
    const line = d3.line().curve(d3.curveBasis);
    const links = svg
      .append("g")
      .selectAll("path")
      .data(graph.links())
      .enter()
      .append("path")
      .attr("d", function (d) {
        const sourceLevel = d.source.data.level;
        const targetLevel = d.target.data.level;

        const sourceY =
          sourceLevel * (dagHeight / dagDepth) + d.source.data.nodeSize / 2;
        const targetY =
          targetLevel * (dagHeight / dagDepth) - d.target.data.nodeSize / 2;

        /* straight line */
        const midY = (sourceY + targetY) / 2;

        const newPoints = [
          [d.source.x, sourceY],
          [(d.source.x + d.target.x) / 2, midY],
          [d.target.x, targetY],
        ];

        return line(newPoints);
      })
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke", "lightgray");

    function process() {
      const processNode = (node) => {
        cheapestId.push(generateNodeId(node));

        if (node.join) makeCheapestPath(node.join);

        let sub = node.sub;
        while (sub) {
          cheapestId.push(generateNodeId(sub));
          if (sub.join) makeCheapestPath(sub.join);
          sub = sub.sub;
        }
      };

      const makeCheapestPath = (node) => {
        processNode(node.outer);
        processNode(node.inner);
      };

      const numRels = dp[dp.length - 1].relid.split(" ").length;
      data.forEach((d) => {
        if (d.id.split(" ").length === numRels && !d.id.includes(" - ")) {
          cheapestId.push(generateNodeId(d.nodeData.cheapest_total_paths));
          makeCheapestPath(d.nodeData.cheapest_total_paths.join);
        }
      });
    }

    function animate(level) {
      if (level > dagDepth) return;

      var cheapestInnerId = [];
      var cheapestOuterId = [];

      nodes
        .filter(function (d) {
          return Math.floor(d.data.level) === level + 1; // relations
        })
        .each(function (d) {
          if (d.data.nodeData.cheapest_total_paths?.join) {
            cheapestInnerId.push(
              `${index} ${d.data.nodeData.cheapest_total_paths.join.inner.relid}`.replace(
                /\s/g,
                ""
              )
            );
            cheapestOuterId.push(
              `${index} ${d.data.nodeData.cheapest_total_paths.join.outer.relid}`.replace(
                /\s/g,
                ""
              )
            );
          }
        });

      // 1. makes nodes appear
      nodes
        .filter(function (d) {
          return (
            Math.floor(d.data.level) === level ||
            Math.floor(d.data.level) === level + 1
          );
        })
        .transition()
        .duration(1000)
        .style("opacity", 1);

      // 2. makes links appear
      links
        .filter(function (d) {
          return (
            Math.floor(d.target.data.level) === level ||
            Math.floor(d.target.data.level) === level + 1
          );
        })
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .end()
        .then(() => {
          // 3. leave only cheapest path
          nodes
            .filter(function (d) {
              return (
                (Math.floor(d.data.level) === level &&
                  !cheapestId.includes(
                    `${index} ${d.data.id}`.replace(/\s/g, "")
                  )) ||
                (Math.floor(d.data.level) === level + 1 &&
                  !cheapestId.some((id) => {
                    const relid = id.split("-").slice(0, -1).join("-");
                    return `${index} ${d.data.id}`.replace(/\s/g, "") === relid;
                  }))
              );
            })
            .transition()
            .duration(1000)
            .style("opacity", 0.3);

          links
            .filter(function (d) {
              return (
                (Math.floor(d.target.data.level) === level &&
                  (!cheapestId.includes(
                    `${index} ${d.target.data.id}`.replace(/\s/g, "")
                  ) ||
                    (!cheapestInnerId.includes(
                      `${index} ${d.source.data.id}`.replace(/\s/g, "")
                    ) &&
                      !cheapestOuterId.includes(
                        `${index} ${d.source.data.id}`.replace(/\s/g, "")
                      )))) ||
                (Math.floor(d.target.data.level) === level + 1 &&
                  !cheapestId.includes(
                    `${index} ${d.source.data.id}`.replace(/\s/g, "")
                  ))
              );
            })
            .transition()
            .duration(1000)
            .style("opacity", 0.3)
            .end()
            .then(() => {
              animate(level + 2);
            });
        });
    }

    if (animation) {
      if (dp.length === 0) {
        data.forEach((d) => {
          if (!d.id.includes(" - ")) {
            cheapestId.push(generateNodeId(d.nodeData.cheapest_total_paths));
          }
        });
      } else if (dp.length > 0) process();

      nodes.style("opacity", "0");
      links.style("opacity", "0");

      animate(0);
    }
  }

  useEffect(() => {
    const nodeMap = new Map();
    drawGraph({
      graphSvg: dagSvg,
      data: parseDp(base, dp, nodeMap),
    });
  }, [base, dp, showCostScale, animation]);

  return (
    <div>
      <div>
        <div className="flex items-center gap-4 mb-2">
          <button
            className="text-bsm"
            id="play-button"
            onClick={handleClickPlay}
          >
            {animation ? "Stop" : "Play"}
          </button>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showCostScale}
                  onChange={(event) => setShowCostScale(event.target.checked)}
                  size="small"
                />
              }
              label={<div className="text-bsm">Show Cost Scale</div>}
            />
          </div>
        </div>
      </div>
      <div>
        <svg
          className="bg-white rounded-lg"
          ref={dagSvg}
          width={svgWidth}
          height={svgHeight}
        />
      </div>
    </div>
  );
};

export default GraphView;
