import React, { useEffect, useState, useRef } from "react";
import { parseDp } from "./parseDp";
import data from "../../data/dp/dp.json";
import * as d3 from "d3";
import * as d3dag from "https://cdn.skypack.dev/d3-dag@1.0.0-1";


const Dp = (props) => {
    const dagSvg = useRef(null);
    const svgHeight = 1920;
    const svgWidth = document.body.clientWidth;
    const marginY = 35;


    const [results, setResults] = useState([]);
    useEffect(() => {
      const result = parseDp(data);
      setResults(result);
      }, [])


    // --------- //
    // Rendering //
    // --------- //
    useEffect(() => {
        d3.select(dagSvg.current).selectAll("*").remove(); //clear

        try{
        // create our builder and turn data into a graph
        const graph = d3dag.graphStratify()(results);

        // -------------- //
        // Compute Layout //
        // -------------- //
        // set the layout functions
        const nodeRadius = 20;
        const nodeSize = [nodeRadius * 2, nodeRadius * 2];
        // this truncates the edges so we can render arrows nicely
        const shape = d3dag.tweakShape(nodeSize, d3dag.shapeEllipse);

        // use this to render our edges
        const line = d3.line().curve(d3.curveMonotoneY);
        // here's the layout operator, uncomment some of the settings
        const layout = d3dag
          .sugiyama()
          .nodeSize(nodeSize)
          .gap([nodeRadius, nodeRadius])
          .tweaks([shape]);



        // actually perform the layout and get the final size
        const { width, height } = layout(graph);
      
        // color
        const steps = graph.nnodes() - 1;
        const interp = d3.interpolateRainbow;
        const colorMap = new Map(
          [...graph.nodes()]
            .sort((a, b) => a.y - b.y)
            .map((node, i) => [node.data.id, interp(i / steps)])
        );

        // create graph
        const svg = d3
        .select(dagSvg.current);

        svg
        .append("svg")
        .attr("width", width)
        .attr("height", height + 2 * marginY)
        .append("g") // 그룹으로 묶어서
        // .attr("transform", `translate(${width / 2}, ${marginY})`) // margin 적용
        .attr('transform', `scale(1, -1) translate(0, -${height})`, {marginY})
        .call(
          d3.zoom().on("zoom", (event) => {
            svg.attr("transform", event.transform);
          })
        )
        .append("g");

        // create links
        svg
        .append("g")
        .selectAll("path")
        .data(graph.links())
        .enter()
        .append("path")
        .attr("d", ({ points }) => line(points))
        .attr("fill", "none")
        .attr("stroke-width", 3)
        .attr("stroke", "lightgrey")
        .attr("g")

        // create nodes
        const nodes = svg
        .append("g")
        .selectAll("g")
        .data(graph.nodes())
        .enter()
        .append("g")
        .attr("transform", ({ x, y }) => `translate(${x}, ${y})`);

        // create node circles
        nodes
        .append("circle")
        .attr("r", nodeRadius)
        .attr("fill", (n) => {
          const color = colorMap.get(n.data.id);
          return color;
        });

        // create arrows
        const arrowSize = (nodeRadius * nodeRadius) / 5.0;
        const arrowLen = Math.sqrt((4 * arrowSize) / Math.sqrt(3));
        const arrow = d3.symbol().type(d3.symbolTriangle).size(arrowSize);
        svg
          .append("g")
          .selectAll("path")
          .data(graph.links())
          .enter()
          .append("path")
          .attr("d", arrow)
          .attr("transform", ({ points }) => {
            const [[sx, sy], [ex, ey]] = points.slice(-2);
            const dx = sx - ex;
            const dy = sy - ey;
            // This is the angle of the last line segment
            const angle = (Math.atan2(-dy, -dx) * 180) / Math.PI + 90;
            return `translate(${ex}, ${ey}) rotate(${angle})`;
          })
          .attr("fill", ({ target }) => colorMap[target.data.id])
          .attr("stroke", "white")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", `${arrowLen},${arrowLen}`);


          // add text to nodes
          nodes
          .append("text")
          .text((d) => d.data.id)
          .attr("font-weight", "bold")
          .attr("font-family", "sans-serif")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("fill", "white");


    } catch (error) {
      console.error("Error building graph:", error);
    }
    }
    )


    return (
        <div>
          <h1>DP</h1>
          <svg
          className="node-label"
          ref={dagSvg}
          width={svgWidth}
          height={svgHeight}>
          </svg>
        </div>
    );
}

export default Dp;
