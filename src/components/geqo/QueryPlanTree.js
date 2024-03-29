import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { nodeColor } from "./tree";

const QueryPlanTree = ({ width, height, plan }) => {
  const treeSvg = useRef(null);
  const minimapSvg = useRef(null);

  const marginY = 0;
  const defaultRadius = 8;

  // data를 d3의 계층 구조로 바꾸어주기
  const root = d3.hierarchy(plan);

  const dx = width / 4;
  const dy = 30;

  const treeLayout = d3.tree().nodeSize([dx, dy]);
  const treeData = treeLayout(root);
  const diagonal = d3
    .linkVertical()
    .x((d) => d.x)
    .y((d) => d.y);

  let x0 = 0,
    x1 = 0,
    y0 = 0,
    y1 = 0;

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
  let zooming = false;

  useEffect(() => {
    d3.select(treeSvg.current).selectAll("*").remove(); // clear
    d3.select(minimapSvg.current).selectAll("*").remove(); // clear

    const zoom = d3.zoom().on("zoom", function (event) {
      if (brushing) return;
      zooming = true;

      svg.attr("transform", event.transform);

      // Adjust the size of the minimap's brush
      const zoomScale = event.transform.k;
      const tx = -event.transform.x / zoomScale;
      const ty = -event.transform.y / zoomScale;

      gBrush.call(brush.move, [
        [tx, ty],
        [tx + 300 / zoomScale, ty + 300 / zoomScale],
      ]);

      zooming = false;
    });

    // create tree
    const svg = d3
      .select(treeSvg.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height + 2 * marginY)
      .append("g") // 그룹으로 묶어서
      .attr("transform", `translate(${width / 2}, ${marginY})`) // margin 적용
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

    // 실제 tree의 width, height와 같아야 함
    const treeWidth = (dx * treeData.height) / 2;
    const treeHeight = dy * treeData.height;

    const minimap = d3
      .select(minimapSvg.current)
      .append("svg")
      .attr("width", 200)
      .attr("height", 200 * ((y1 - y0) / (x1 - x0)))
      .attr("viewBox", [x0, y0, x1 - x0, y1 - y0]);

    // minimap
    //   .append("rect")
    //   .attr("width", width)
    //   .attr("height", height)
    //   .attr("fill", "pink");

    // create links
    const mLink = minimap
      .append("g")
      .attr("id", "m-link")
      .attr("fill", "none")
      .attr("stroke", "lightgray");

    // create nodes
    const mNode = minimap.append("g").attr("id", "m-node");

    const brush = d3
      .brush()
      .extent([
        [x0, y0],
        [x1, y1],
      ])
      .on("brush", function (event) {
        if (zooming) return;
        brushing = true;

        let [[x0, y0], [x1, y1]] = event.selection;

        // Update the zoom transform of the SVG
        const zoomScale = 300 / (x1 - x0);
        svg.attr(
          "transform",
          `translate(${-x0 * zoomScale}, ${-y0 * zoomScale})`
        );

        brushing = false;
      });

    const gBrush = minimap.append("g").attr("id", "minimap-brush").call(brush);

    gBrush.call(brush.move, [
      [root.x - 150, root.y],
      [root.x + 150, root.y + 300],
    ]);

    minimap.selectAll(".handle").remove(); // brush size 조절 못하도록
    minimap.selectAll(".overlay").remove(); // brush 새로 그리지 못하도록

    function update(event, source) {
      const nodes = root.descendants().reverse();
      const links = root.links();
      const transition = svg.transition().duration(500);

      // update nodes
      const node = gNode.selectAll("g").data(nodes, (d) => d.id);
      const mnode = mNode.selectAll("g").data(nodes, (d) => d.id);

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
      const mnodeEnter = mnode
        .enter()
        .append("g")
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
      mnodeEnter
        .append("circle")
        .attr("id", "mnode-circle")
        .attr("fill", (d) => nodeColor(d.data["Node Type"]))
        .attr("r", defaultRadius);

      // append node type
      nodeEnter
        .append("text")
        .attr("id", "node-type")
        .attr("class", "node-type")
        .attr("text-anchor", "start")
        .text((d) => d.data["Node Type"]);
      mnodeEnter
        .append("text")
        .attr("id", "mnode-type")
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
      mnodeEnter
        .append("text")
        .attr("id", "mrelation-name")
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
      mnode
        .merge(mnodeEnter)
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
      mnode.exit().remove().attr("fill-opacity", 0).attr("stroke-opacity", 0);

      // update links
      const link = gLink.selectAll("path").data(links, (d) => d.target.id);
      const mlink = mLink.selectAll("path").data(links, (d) => d.target.id);

      // enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .append("path")
        .attr("id", "link-path")
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });
      const mlinkEnter = mlink
        .enter()
        .append("path")
        .attr("id", "mlink-path")
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      link.merge(linkEnter).transition(transition).attr("d", diagonal);
      mlink.merge(mlinkEnter).attr("d", diagonal);

      link
        .exit()
        .transition(transition)
        .remove()
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });
      mlink
        .exit()
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
  }, [width, height, plan]);

  return (
    <div>
      <svg ref={treeSvg} width={width} height={height + 2 * marginY} />
      {/* <svg ref={minimapSvg} /> */}
    </div>
  );
};

export default QueryPlanTree;
