import React, { useEffect, useState, useRef } from "react";
import "../../assets/stylesheets/Dp.css";
import { parseDp } from "./parseDp";
import dp from "../../data/dp/dp.json";
import * as d3 from "d3";
import * as d3dag from "https://cdn.skypack.dev/d3-dag@1.0.0-1";
import { sliderBottom } from 'd3-simple-slider';
// import { Checkbox, Button } from "@material-tailwind/react";

const Dp = (props) => {
    const dagSvg = useRef(null);
    const sliderRef = useRef(null);
   
    const svgHeight = 1280;
    const svgWidth = document.body.clientWidth;
    const sliderWidth = 300;
    const sliderHeight = 100; 
    const sliderMargin = { top: 20, right: 50, bottom: 20, left: 50 };
    
    const marginY = 35;
    
    const query = dp.query;
    const queryResult = dp.result;

    const targetEntry = dp.optimizer.dp[dp.optimizer.dp.length - 1];
    const totalCost = targetEntry ? targetEntry.cheapest_total_paths.total_cost : "N/A"; 

    const [results, setResults] = useState([]);
    useEffect(() => {
      const result = parseDp(dp);
      setResults(result);
      }, [])


    // --------- //
    // Rendering //
    // --------- //
    useEffect(() => {
        d3.select(dagSvg.current).selectAll("*").remove(); //clear
        d3.select(sliderRef.current).selectAll("*").remove();

        try{
        const graph = d3dag.graphStratify()(results);

        // -------------- //
        // Compute Layout //
        // -------------- //
        // set the layout functions
        const nodeRadius = 25;
        const nodeSize = [nodeRadius * 2, nodeRadius * 2];
        // this truncates the edges so we can render arrows nicely
        const shape = d3dag.tweakShape(nodeSize, d3dag.shapeEllipse);

        // use this to render our edges
        const line = d3.line().curve(d3.curveMonotoneY);
        const layout = d3dag.sugiyama()
        .nodeSize(node => {
            if (node.data.id.includes(" - ")) {
                const textLength = node.data.id.length * 6;
                return [textLength + 20, 30]; 
            } else {
                return [50, 50]; // Size for circles
            }
        })
        .gap([20, 20])
        .tweaks([shape]);

        // actually perform the layout and get the final size
        const { width, height } = layout(graph);
      
        // color
        const colorMap = new Map();
        const nodesArray = Array.from(graph.nodes());
        
        const nodeTypes = [...new Set(nodesArray.map(node => {
            const parts = node.data.id.split(" - ");
            return parts.length > 1 ? parts[1] : node.data.id; 
        }))];
                nodeTypes.forEach((type, i) => {
            colorMap.set(type, d3.interpolateRainbow(i / nodeTypes.length));
        });

        // create graph
        const svg = d3
        .select(dagSvg.current);

        svg
        .append("svg")
        .attr("width", width)
        .attr("height", height + 2 * marginY)
        .append("g") // 그룹으로 묶어서
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
        
        nodes.each(function(d) {
          const node = d3.select(this);
          const parts = d.data.id.split(" - ");
          const nodeType = parts.length > 1 ? parts[1] : parts[0];
      
          if (d.data.id.includes(" - ")) { 
              node.append("rect")
                  .attr("width", d.data.id.length * 6 + 20)
                  .attr("height", 30)
                  .attr("x", -d.data.id.length * 3 - 10)
                  .attr("y", -15)
                  .attr("fill", colorMap.get(nodeType))
                  .attr("stroke", "black");
          } else {
              node.append("circle")
                  .attr("r", nodeRadius) 
                  .attr("fill", colorMap.get(nodeType));
          }
      });
      
      // text 
      nodes.append("text")
          .text(d => d.data.id.split(" - ").pop()) 
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("fill", "white");

        // create arrows
        const arrowSize = (nodeRadius * nodeRadius) / 20.0;
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

    } catch (error) {
      console.error("Error building graph:", error);
    }

      const sliderSvg = d3.select(sliderRef.current);
      sliderSvg.attr('width', sliderWidth).attr('height', sliderHeight);
      const x = d3.scaleLinear()
      .domain([0, 100]) // 슬라이더 범위
      .range([sliderMargin.left, sliderWidth - sliderMargin.right])
      .clamp(true);

      sliderSvg.append('g')
      .attr('class', 'slider')
      .attr('transform', `translate(0,${sliderHeight / 2})`)
      .call(sliderBottom(x)
      .step(1)
      .ticks(5));
      }
    )

    return (
        <div>
          <h1>DP</h1>
          <h2>Query</h2>
          <p>{query}</p>
          <h2>Result</h2>
          <p>{queryResult}</p>
          <h2>Total Cost</h2>
          <p>{totalCost}</p>
          <div className="controls-container">
                <input type="button" value="Play/Pause" />
                <svg className="slider" ref={sliderRef} width={sliderWidth} height={sliderHeight}></svg>
          </div>
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
