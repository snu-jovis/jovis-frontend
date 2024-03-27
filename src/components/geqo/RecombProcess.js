import React, { useContext, useEffect, useRef } from "react";
import * as d3 from "d3";
import { GeqoContext } from "../providers/GeqoProvider";
import "../../assets/stylesheets/RecombProcess.css";

function preprocessData(relMap, data) {
  const numbers = data.split(" ").map(Number);

  const nodes = numbers.map((num, i) => ({
    id: num,
    name: relMap[num.toString()],
  }));

  const links = numbers.map((num, i) => ({
    source: num,
    target: numbers[(i + 1) % numbers.length],
  }));

  return { nodes, links };
}

function addColor(momData, dadData, childData) {
  momData.links.forEach((momLink) => {
    const childLink = childData.links.find(
      (link) =>
        (link.source === momLink.source && link.target === momLink.target) ||
        (link.source === momLink.target && link.target === momLink.source)
    );

    if (childLink) {
      const color = "red";
      momLink.color = [color];
      childLink.color = childLink.color || [];
      childLink.color.push(color);
    } else {
      momLink.color = ["lightgrey"];
    }
  });

  dadData.links.forEach((dadLink) => {
    const childLink = childData.links.find(
      (link) =>
        (link.source === dadLink.source && link.target === dadLink.target) ||
        (link.source === dadLink.target && link.target === dadLink.source)
    );

    if (childLink) {
      const color = "blue";
      dadLink.color = [color];
      childLink.color = childLink.color || [];
      childLink.color.push(color);
    } else {
      dadLink.color = ["lightgrey"];
    }
  });

  childData.links.forEach((link) => {
    if (!link.color) link.color = ["green"];
  });
}

const RecombProcess = ({ width, height }) => {
  const { relMap, mom, dad, child } = useContext(GeqoContext);

  const momRef = useRef();
  const dadRef = useRef();
  const childRef = useRef();

  const subHeight = height / 3;
  const margin = { top: 10, right: 0, bottom: 10, left: 20 };

  function drawGraph(svgRef, data) {
    const domain = Object.keys(relMap).map(Number); // [1, 2, 3, 4, 5]
    const y = d3.scalePoint(domain, [0, subHeight]);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", subHeight + margin.top + margin.bottom)
      .append("g");
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // Add a circle for each node.
    svg
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("cx", margin.left)
      .attr("cy", (d) => y(d.id) + margin.top)
      .attr("r", 4);

    // Define the gradients
    var defs = svg.append("defs");
    var gradient = defs
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "red");

    gradient
      .append("stop")
      .attr("offset", 50 + "%")
      .attr("stop-color", "red");

    gradient
      .append("stop")
      .attr("offset", 50 + "%")
      .attr("stop-color", "blue");

    gradient
      .append("stop")
      .attr("offset", 100 + "%")
      .attr("stop-color", "blue");

    // svg
    //   .append("defs")
    //   .selectAll("linearGradient")
    //   .data(data.links)
    //   .join("linearGradient")
    //   .attr("id", (d, i) => `gradient-${i}`)
    //   .selectAll("stop")
    //   .data((d) => d.color)
    //   .join("stop")
    //   .attr("offset", function (d, i, n) {
    //     console.log(d, i, n);
    //     return `${(i + 1) * 50}%`;
    //   })
    //   .attr("stop-color", function (d) {
    //     console.log(d);
    //     return d;
    //   });

    // Add an arc for each link.
    svg
      .selectAll("path")
      .data(data.links)
      .join("path")
      .attr("d", (d) => {
        const y1 = y(d.source) + margin.top;
        const y2 = y(d.target) + margin.top;
        const r = Math.abs(y2 - y1) / 2;

        return `M${margin.left},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${
          margin.left
        },${y2}`;
      })
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke", function (d, i) {
        if (d.color.length === 2) {
          return `url(#gradient)`;
        } else {
          return d.color[0];
        }
      });

    // Add a text label and a dot for each node.
    svg
      .append("g")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .attr(
        "transform",
        (d) => `translate(${margin.left},${y(d.id) + margin.top})`
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", -6)
          .attr("dy", "0.35em")
          .text((d) => d.name)
      );
  }

  useEffect(() => {
    if ((mom !== "") & (dad !== "") & (child !== "")) {
      const momData = preprocessData(relMap, mom);
      const dadData = preprocessData(relMap, dad);
      const childData = preprocessData(relMap, child);

      addColor(momData, dadData, childData);

      drawGraph(momRef, momData);
      drawGraph(dadRef, dadData);
      drawGraph(childRef, childData);
    }
  });

  return (
    <>
      {mom && dad && child ? (
        <>
          <div className="parents-container">
            <svg ref={momRef} />
            <h1 className="sign">+</h1>
            <svg ref={dadRef} />
          </div>
          <h1 className="sign">=</h1>
          <div className="child-container">
            <svg ref={childRef} />
          </div>
        </>
      ) : null}
    </>
  );
};

export default RecombProcess;
