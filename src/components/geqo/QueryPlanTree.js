import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { nodeColor } from "./tree";
import { Card } from "@material-tailwind/react";

const QueryPlanTree = ({ plan }) => {
  plan = JSON.stringify(plan).replace(/"Plans":/g, '"children":');
  plan = JSON.parse(plan);

  const treeSvg = useRef(null);
  const svgWidth = 400;
  const svgHeight = 400;
  const margin = { x: 50, y: 50 };
  const defaultRadius = 8;

  const root = d3.hierarchy(plan);

  const dx = 100;
  const dy = 50;

  const treeLayout = d3.tree().nodeSize([dx, dy]);
  treeLayout(root);

  const diagonal = d3
    .linkVertical()
    .x((d) => d.x)
    .y((d) => d.y);

  let [x0, x1, y0, y1] = [0, 0, 0, 0];

  root.x0 = 0;
  root.y0 = dy / 2;

  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;

    if (d.x < x0) {
      x0 = d.x;
    }
    if (d.x > x1) {
      x1 = d.x;
    }
    if (d.y < y0) {
      y0 = d.y;
    }
    if (d.y > y1) {
      y1 = d.y;
    }
  });

  let brushing = false;
  useEffect(() => {
    d3.select(treeSvg.current).selectAll("*").remove();

    const zoom = d3.zoom().on("zoom", function (event) {
      if (brushing) return;
      svg.attr("transform", event.transform);
    });

    // create tree
    const svg = d3
      .select(treeSvg.current)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight + 2 * margin.y)
      .append("g")
      .attr("transform", `translate(${svgWidth / 2}, ${margin.y})`)
      .call(zoom)
      .append("g");

    // create links
    const gLink = svg
      .append("g")
      .attr("id", "g-link")
      .attr("fill", "none")
      .attr("stroke", "lightgray");

    // create nodes
    const gNode = svg.append("g").attr("id", "g-node");

    function update(event, source) {
      const nodes = root.descendants().reverse();
      const links = root.links();
      const transition = svg.transition().duration(500);

      // update nodes
      const node = gNode.selectAll("g").data(nodes, (d) => d.id);

      // enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${source.x0},${source.y0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });

      // append circles
      nodeEnter
        .append("circle")
        .attr("id", "node-circle")
        .attr("fill", (d) => nodeColor(d.data["Node Type"]))
        .attr("r", defaultRadius);

      // append node type
      nodeEnter
        .append("text")
        .attr("id", "node-type")
        .attr("class", "node-type")
        .attr("text-anchor", "start")
        .text((d) => d.data["Node Type"]);

      // append relation name
      nodeEnter
        .append("text")
        .attr("id", "relation-name")
        .attr("class", "relation-name")
        .attr("dy", 12)
        .attr("text-anchor", "start")
        .text((d) =>
          d.data["Relation Name"]
            ? d.data["Relation Name"].toUpperCase()
            : d.data.table_name
            ? d.data.table_name.toUpperCase()
            : null
        );

      node
        .merge(nodeEnter)
        .transition(transition)
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      node
        .exit()
        .transition(transition)
        .remove()
        .attr("transform", (d) => `translate(${source.x},${source.y})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // update links
      const link = gLink.selectAll("path").data(links, (d) => d.target.id);

      // enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .append("path")
        .attr("id", "link-path")
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      link.merge(linkEnter).transition(transition).attr("d", diagonal);

      link
        .exit()
        .transition(transition)
        .remove()
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      root.eachBefore((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(null, root);
  }, []);

  return (
    <Card className="w-[400px]">
      <svg ref={treeSvg} width={svgWidth} height={svgHeight} />
    </Card>
  );
};

export default QueryPlanTree;
