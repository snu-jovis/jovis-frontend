import { useEffect, useRef, useContext, useState } from "react";
import * as d3 from "d3";
import { GeqoContext } from "../providers/GeqoProvider";

const JoinOrderTree = ({ width, height, data: relOptInfo }) => {
  const { chosen } = useContext(GeqoContext);
  const chosenRelOptInfo = relOptInfo[chosen];
  console.log(chosenRelOptInfo);

  const svgHeight = height;
  const [fitness, setFitness] = useState(0);
  const [selectedCost, setSelectedCost] = useState("");

  var nodeId = 0;
  function convertPath(node, parent = null) {
    const newNode = {
      id: nodeId++,
      name: node.node,
      parent,
      children: [],
      relid: node.relid,
      rows: node.rows,
      startup_cost: node.startup_cost,
      total_cost: node.total_cost,
    };

    if (node.join) {
      if (node.join.outer) {
        newNode.children.push(convertPath(node.join.outer, newNode));
      }
      if (node.join.inner) {
        newNode.children.push(convertPath(node.join.inner, newNode));
      }
    } else if (node.sub) {
      newNode.children.push(convertPath(node.sub, newNode));
    }

    return newNode;
  }

  function flatten(root, all) {
    const nodes = [];
    const costs = [];

    // DFS traversal
    function recurse(node) {
      let childrenCost = 0;
      if (node.children) {
        node.children.forEach((child) => {
          recurse(child);
          childrenCost += child.data.total_cost;
        });
      }

      if (all) nodes.push(node);
      else nodes.push(node.data.total_cost - childrenCost);

      costs.push(node.data.total_cost - childrenCost);
    }
    recurse(root);

    if (all) return { nodes, costs };
    return nodes;
  }

  const treeRef = useRef(null);
  const barRef = useRef(null);

  const treeWidth = (width * 3) / 4;
  const barWidth = width / 4;
  const relRadius = 12;
  const opRadius = 8;

  const dx = treeWidth / 5;
  const dy = 40;
  const margin = { x: 20, top: 30 };
  const barMargin = { x: 35, y: 20 };

  const treeLayout = d3.tree().nodeSize([dx, dy]);

  const diagonal = d3
    .linkVertical()
    .x((d) => d.x)
    .y((d) => d.y);

  useEffect(() => {
    if (!chosenRelOptInfo) return;

    setFitness(
      d3.format(".0f")(chosenRelOptInfo.cheapest_total_paths.total_cost)
    );

    /* Tree */
    const treeData = convertPath(chosenRelOptInfo.cheapest_total_paths);
    const root = d3.hierarchy(treeData);
    treeLayout(root);

    d3.select(treeRef.current).selectAll("*").remove(); // clear

    const svg = d3
      .select(treeRef.current)
      .append("svg")
      .attr("width", treeWidth - margin.x)
      .attr("height", svgHeight)
      .append("g")
      .attr(
        "transform",
        `translate(${treeWidth - treeWidth / 3}, ${margin.top})`
      )
      .call(
        d3.zoom().on("zoom", (event) => {
          svg.attr("transform", event.transform);
        })
      )
      .append("g");

    const gLink = svg
      .append("g")
      .attr("id", "g-link")
      .attr("fill", "none")
      .attr("stroke", "lightgray");

    const gNode = svg.append("g").attr("id", "g-node");

    function update(event, source) {
      const nodes = root.descendants().reverse();
      const links = root.links();
      const transition = svg.transition().duration(500);

      const node = gNode.selectAll("g").data(nodes, (d) => d.id);
      const nodeEnter = node.enter().append("g");

      nodeEnter
        .append("circle")
        .attr("id", (d) => {
          return `node-circle-${d.data.id}`;
        })
        .attr("fill", (d) =>
          d.children ? d3.schemePastel2[2] : d3.schemePastel1[0]
        )
        .attr("r", (d) => (d.children ? opRadius : relRadius));

      nodeEnter
        .append("text")
        .attr("id", "node-type")
        .attr("class", "text-rxsm")
        .attr("dy", (d) => (d.children ? "0.3em" : "-0.2em"))
        .attr("text-anchor", "middle")
        .text((d) => d.data.name);

      nodeEnter
        .append("text")
        .attr("id", "node-type")
        .attr("class", "text-bxsm")
        .attr("dy", function (d) {
          if (
            d.depth === root.height &&
            d.parent.children[0].data.relid.length > 8
          ) {
            if (d.data.relid === d.parent.children[0].data.relid)
              return "1.6em";
            else return "0.7em";
          } else return "0.8em";
        })
        .attr("text-anchor", "start")
        .text(function (d) {
          if (!d.children) return d.data.relid;
        });

      node
        .merge(nodeEnter)
        .transition(transition)
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      const link = gLink.selectAll("path").data(links, (d) => d.target.id);
      const linkEnter = link
        .enter()
        .append("path")
        .attr("id", "link-path")
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      link.merge(linkEnter).transition(transition).attr("d", diagonal);
    }

    root.x0 = 0;
    root.y0 = dy / 2;

    update(null, root);

    /* Stacked Bar Chart */
    const barSvg = d3.select(barRef.current);
    barSvg.selectAll("*").remove(); // clear

    const runCost = flatten(root, false);
    const stackedData = runCost.reduce((acc, curr, i) => {
      acc[i] = curr;
      return acc;
    }, {});
    const stack = d3.stack().keys(Object.keys(stackedData));
    const series = stack([stackedData]);

    // calculate the sum of values for each group
    const groupSums = series[0].map((_, i) =>
      d3.sum(series.map((layer) => layer[i][1] - layer[i][0]))
    );

    // normalize the data
    series.forEach((layer) => {
      layer.forEach((d, i) => {
        d[0] = d[0] / groupSums[i];
        d[1] = d[1] / groupSums[i];
      });
    });

    const barYScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([svgHeight - 2 * barMargin.y, 0]);
    const barYAxis = d3.axisLeft(barYScale).tickFormat(d3.format(".0%"));

    barSvg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${barMargin.x}, ${barMargin.y})`)
      .transition()
      .duration(1000)
      .call(barYAxis);

    // create stack rect
    const rect = barSvg
      .selectAll()
      .data(series)
      .enter()
      .append("g")
      .attr("fill", (d, i) => d3.schemeSet3[i % 12]);

    // stack rect for each data value
    rect
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", barMargin.x + 2)
      .attr("y", svgHeight - barMargin.y)
      .attr("height", 0)
      .attr("width", barWidth / 3)
      .transition()
      .duration(1000)
      .attr("y", (d) => barYScale(d[1]) + barMargin.y)
      .attr("height", (d) => barYScale(d[0]) - barYScale(d[1]));

    /* Mapping with Tree */
    const { nodes: flatTree, costs: computedCosts } = flatten(root, true);

    var prev = -1;
    rect.selectAll("rect").on("click", function (event, d) {
      const i = series.findIndex((element) => element[0] === d);
      const clickedNode = flatTree[i].data.id;

      if (clickedNode === prev) {
        setSelectedCost("");

        svg
          .selectAll("circle")
          .transition()
          .duration(500)
          .attr("fill", (d) =>
            d.children ? d3.schemePastel2[2] : d3.schemePastel1[0]
          );

        prev = -1;

        return;
      }

      const percent = (d[1] - d[0]).toLocaleString("en-US", {
        style: "percent",
        minimumFractionDigits: 1,
      });

      setSelectedCost(
        `Run Cost: ${d3.format(".0f")(computedCosts[i])} (${percent})`
      );

      svg
        .selectAll("circle")
        .transition()
        .duration(500)
        .attr("fill", "ghostwhite");

      svg
        .select(`#node-circle-${clickedNode}`)
        .transition()
        .duration(500)
        .attr("fill", d3.schemeSet3[3]);

      prev = clickedNode;
    });
  }, [chosen]);

  return (
    <div>
      <div className="flex justify-between px-4 pt-2">
        <p className="text-ebsm">Join Order Tree</p>
      </div>
      {chosenRelOptInfo ? (
        <div className="h-[340px]">
          <div className="flex">
            <svg ref={treeRef} width={treeWidth} height={svgHeight} />
            <svg ref={barRef} width={barWidth} height={svgHeight} />
          </div>
          <hr className="mx-2 mb-2 border-1" />
          <div className="flex justify-center gap-2">
            <p className="text-rsm">Fitness: {fitness}</p>
            <p className="text-rsm">{selectedCost}</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[340px]">
          <span className="text-bsm">Choose a gene to see the join order.</span>
        </div>
      )}
    </div>
  );
};

export default JoinOrderTree;
