import React, { useEffect, useState, useRef } from "react";
import { parseDp, parseOptimalOne } from "./parseDp";
import * as d3 from "d3";
import * as d3dag from "https://cdn.skypack.dev/d3-dag@1.0.0-1";
import { Checkbox } from "@material-tailwind/react";

import "../../assets/stylesheets/Dp.css";

const GraphView = ({ width, height, data }) => {
  const dagSvg = useRef(null);
  const svgWidth = width;
  const svgHeight = height - 50;
  const margin = { x: 0, y: 20 };

  const [animation, setAnimation] = useState(false);
  const [showOptimalOne, setShowOptimalOne] = useState(false);
  const [costText, setCostText] = useState("Total Cost for Cheapest Path");
  const [totalCost, setTotalCost] = useState(
    data.optimizer.dp[data.optimizer.dp.length - 1].cheapest_total_paths
      .total_cost
  );

  const handleCheckboxChange = () => {
    setShowOptimalOne((prev) => !prev);
  };

  const handleClickPlay = () => {
    setAnimation((prev) => !prev);
  };

  function mapName(name) {
    switch (name) {
      case "SeqScan":
        return "Seq\nScan";
      case "HashJoin":
        return "Hash\nJoin";
      case "MergeJoin":
        return "Merge\nJoin";
      case "NestLoop":
        return "Nested\nLoop";
      case "IdxScan":
        return "Index\nScan";
      default:
        return name;
    }
  }

  function generateNodeId(d) {
    return `${d.relid} - ${d.node}`.replace(/\s/g, "");
  }

  function drawGraph({ graphSvg, data }) {
    d3.select(graphSvg.current).selectAll("*").remove(); //clear

    // data graph 형태로 변경
    const graph = d3dag.graphStratify()(data);

    /* coumpute layout */
    const nodeSize = 50;
    const dagDepth = d3.max(data, (d) => d.level);
    const shape = d3dag.tweakShape([nodeSize, nodeSize], d3dag.shapeEllipse);

    const layout = d3dag
      .sugiyama()
      .nodeSize([nodeSize, nodeSize])
      .gap([nodeSize / 4, nodeSize])
      .tweaks([shape]);
    const { width: dagWidth, height: dagHeight } = layout(graph);

    const scale = svgHeight / (dagHeight + margin.y * 2);
    const svg = d3
      .select(graphSvg.current)
      .append("svg")
      .attr("width", dagWidth)
      .attr("height", dagHeight)
      .append("g")
      .attr(
        "transform",
        `scale(${scale}, ${scale}) translate(${
          (svgWidth - dagWidth * scale) / 1.2
        }, ${margin.y})`
      )
      .call(
        d3.zoom().on("zoom", (event) => {
          svg.attr("transform", event.transform);
        })
      )
      .append("g");

    // create links
    const line = d3.line().curve(d3.curveMonotoneY);
    const links = svg
      .append("g")
      .selectAll("path")
      .data(graph.links())
      .enter()
      .append("path")
      .attr("d", function (d) {
        var newPoints = d.points;

        newPoints[0][0] = d.source.x;
        newPoints[0][1] =
          d.source.data.level * (dagHeight / dagDepth) + nodeSize / 2;
        newPoints[d.points.length - 1][0] = d.target.x;
        newPoints[d.points.length - 1][1] =
          d.target.data.level * (dagHeight / dagDepth) - nodeSize / 2;

        return line(newPoints);
      })
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke", "lightgrey");

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

    nodeTypes.forEach((type, i) => {
      colorMap.set(type, d3.schemePastel1[i]);
    });

    nodes.each(function (d) {
      const node = d3.select(this);
      const parts = d.data.id.split(" - ");

      if (parts.length > 1) {
        node
          .append("rect")
          .attr("id", (d) => d.data.id.replace(/\s/g, ""))
          .attr("width", nodeSize)
          .attr("height", nodeSize)
          .attr("x", -nodeSize / 2)
          .attr("y", -nodeSize / 2)
          .attr("fill", colorMap.get(parts[1]));
      } else {
        node
          .append("circle")
          .attr("r", nodeSize / 2)
          .attr("fill", colorMap.get(nodeTypes[0]));
      }
    });

    // node type
    nodes
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("class", "dp-node-text")
      .each(function (d) {
        const lines = mapName(d.data.id.split(" - ").pop()).split("\n");
        if (lines.length === 1) d3.select(this).text(lines[0]);
        else {
          for (let i = 0; i < lines.length; i++) {
            d3.select(this)
              .append("tspan")
              .text(lines[i])
              .attr("x", 0)
              .attr("dy", i ? "1.2em" : "-0em");
          }
        }
      });

    nodes.on("click", function (event, d) {
      if (d.data.nodeData && d.data.nodeData.total_cost) {
        setCostText("Total Cost for Selected Operator");
        setTotalCost(`${d.data.nodeData.total_cost}`);
      } else if (d.data.nodeData && d.data.nodeData.cheapest_total_paths) {
        setCostText("Total Cost for Cheapest Path");
        setTotalCost(`${d.data.nodeData.cheapest_total_paths.total_cost}`);
      }
    });

    function animate(level) {
      if (level > dagDepth) return;

      // store cheapest path for each relation node
      var cheapestId = [];
      var cheapestInnerId = [];
      var cheapestOuterId = [];

      nodes
        .filter(function (d) {
          return d.data.level === level + 1; // relations
        })
        .each(function (d) {
          cheapestId.push(generateNodeId(d.data.nodeData.cheapest_total_paths));
          if (d.data.nodeData.cheapest_total_paths.join) {
            cheapestInnerId.push(
              d.data.nodeData.cheapest_total_paths.join.inner.relid.replace(
                /\s/g,
                ""
              )
            );
            cheapestOuterId.push(
              d.data.nodeData.cheapest_total_paths.join.outer.relid.replace(
                /\s/g,
                ""
              )
            );
          }
        });

      // 1. makes nodes appear
      nodes
        .filter(function (d) {
          return level - 1 < d.data.level && d.data.level <= level + 1;
        })
        .transition()
        .duration(1000)
        .style("opacity", 1);

      // 2. makes links appear
      links
        .filter(function (d) {
          return (
            d.target.data.level === level || d.target.data.level === level + 1
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
                d.data.level === level &&
                !cheapestId.includes(`${d.data.id.replace(/\s/g, "")}`)
              );
            })
            .transition()
            .duration(1000)
            .style("opacity", 0.3);

          links
            .filter(function (d) {
              return (
                (d.target.data.level === level &&
                  (!cheapestId.includes(
                    `${d.target.data.id.replace(/\s/g, "")}`
                  ) ||
                    (!cheapestInnerId.includes(
                      `${d.source.data.id.replace(/\s/g, "")}`
                    ) &&
                      !cheapestOuterId.includes(
                        `${d.source.data.id.replace(/\s/g, "")}`
                      )))) ||
                (d.target.data.level === level + 1 &&
                  !cheapestId.includes(
                    `${d.source.data.id.replace(/\s/g, "")}`
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
      nodes.style("opacity", "0");
      links.style("opacity", "0");
      animate(0);
    }
  }

  useEffect(() => {
    const dpData = parseDp(data);
    const optimalData = parseOptimalOne(data);

    if (showOptimalOne)
      drawGraph({
        graphSvg: dagSvg,
        data: optimalData,
      });
    else {
      drawGraph({
        graphSvg: dagSvg,
        data: dpData,
      });
    }
  }, [data, animation, svgWidth, svgHeight, showOptimalOne]);

  return (
    <>
      <div className="flex justify-between items-center gap-24 ml-4 mb-4">
        <button
          className="dp-play-text"
          id="play-button"
          onClick={handleClickPlay}
        >
          {animation ? "Stop" : "Play"}
        </button>
        <div className="stats shadow">
          <div className="flex m-2 gap-2">
            <div className="dp-total-cost">{costText}</div>
            <div className="dp-cost-value">{totalCost}</div>
          </div>
        </div>
        <div className="checkbox-container">
          <Checkbox
            color="blue"
            className="h-4 w-4 rounded-full border-gray-900/20 bg-gray-900/10 transition-all hover:scale-105 hover:before:opacity-0"
            checked={showOptimalOne}
            label={<p className="text">Show Optimized One</p>}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>
      <div>
        <svg ref={dagSvg} width={svgWidth} height={svgHeight} />
      </div>
    </>
  );
};

export default GraphView;
