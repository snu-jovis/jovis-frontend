import React, { useContext, useEffect, useRef } from "react";
import * as d3 from "d3";
import { GeqoContext } from "../providers/GeqoProvider";

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

function addColorToLinks(parentData, childData, color) {
  parentData.links.forEach((parentLink) => {
    const childLink = childData.links.find(
      (link) =>
        (link.source === parentLink.source &&
          link.target === parentLink.target) ||
        (link.source === parentLink.target && link.target === parentLink.source)
    );

    if (childLink) {
      parentLink.color = [color];
      childLink.color = childLink.color || [];
      childLink.color.push(color);
    } else {
      parentLink.color = ["lightgray"];
    }
  });
}

function addColor(momData, dadData, childData) {
  addColorToLinks(momData, childData, "red");
  addColorToLinks(dadData, childData, "blue");

  childData.links.forEach((link) => {
    if (!link.color) link.color = ["green"];
  });
}

function handleHover(n, d, selectedPath) {
  if (n.source === d.id || n.target === d.id) {
    if (n.color[0] === "red" || n.color[0] === "blue") {
      selectedPath.push(n);

      if (n.color.length === 2) {
        return `url(#gradient)`;
      } else {
        return n.color[0];
      }
    }
    return "gray";
  }
  return "lightgray";
}

function handleChildHover(childRef, selectedPath) {
  const childPath = d3.select(childRef.current).selectAll("path");
  childPath.attr("stroke", function (l) {
    let color = "lightgray";
    selectedPath.some((p) => {
      if (
        (l.source === p.source && l.target === p.target) ||
        (l.target === p.source && l.source === p.target)
      ) {
        color = p.color[0];
        return true;
      }
      return false;
    });
    return color;
  });
}

function handleParentHover(momRef, dadRef, selectedPath) {
  const momPath = d3.select(momRef.current).selectAll("path");
  const dadPath = d3.select(dadRef.current).selectAll("path");

  momPath.attr("stroke", function (l) {
    let color = "lightgray";
    selectedPath.some((p) => {
      if (
        (l.source === p.source && l.target === p.target) ||
        (l.target === p.source && l.source === p.target)
      ) {
        color = "red";
        return true;
      }
      return false;
    });
    return color;
  });

  dadPath.attr("stroke", function (l) {
    let color = "lightgray";
    selectedPath.some((p) => {
      if (
        (l.source === p.source && l.target === p.target) ||
        (l.target === p.source && l.source === p.target)
      ) {
        color = "blue";
        return true;
      }
      return false;
    });
    return color;
  });
}

const EdgeRecomb = ({ width, height, data }) => {
  const relMap = data.geqo.map;

  const { mom, dad, child } = useContext(GeqoContext);

  const momRef = useRef(null);
  const dadRef = useRef(null);
  const childRef = useRef(null);

  function drawGraph(svgRef, data, type) {
    const subWidth = type === "c" ? width : width / 2;
    const subHeight = height / 2;
    const margin = { x: type === "c" ? subWidth / 2 : subWidth / 4, y: 10 };

    const domain = Object.keys(relMap).map(Number);
    const y = d3.scalePoint(domain, [0, subHeight - 2 * margin.y]);

    d3.select(svgRef.current).selectAll("*").remove(); // clear

    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", subWidth)
      .attr("height", subHeight)
      .append("g")
      .call(
        d3.zoom().on("zoom", (event) => {
          svg.attr("transform", event.transform);
        })
      )
      .append("g");

    // add a circle for each node
    svg
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("cx", margin.x)
      .attr("cy", (d) => y(d.id) + margin.y)
      .attr("r", 3);

    // define the gradients
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

    // add an arc for each link
    const path = svg
      .selectAll("path")
      .data(data.links)
      .join("path")
      .attr("d", (d) => {
        const y1 = y(d.source) + margin.y;
        const y2 = y(d.target) + margin.y;
        const r = Math.abs(y2 - y1) / 2;

        return `M${margin.x},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${
          margin.x
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

    // append relation name
    const label = svg
      .append("g")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .attr("id", (d, i) => `label-${i}`)
      .attr("transform", (d) => `translate(${margin.x},${y(d.id) + margin.y})`)
      .call((g) =>
        g
          .append("text")
          .attr("x", -6)
          .attr("dy", "0.35em")
          .text((d) => d.name)
      );

    // add invisible rects for mouseover
    label
      .append("rect")
      .attr("fill", "none")
      .attr("width", 20)
      .attr("height", 20)
      .attr("x", -20)
      .attr("y", -10)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("pointerenter", (event, d) => {
        var selectedPath = [];

        label.attr("font-weight", (n) => (n === d ? "bold" : null));
        path.attr("stroke", (n) => handleHover(n, d, selectedPath));

        if (type !== "c") return handleChildHover(childRef, selectedPath);
        else return handleParentHover(momRef, dadRef, selectedPath);
      })
      .on("pointerout", () => {
        label.attr("font-weight", null);
        path.attr("stroke", function (d, i) {
          if (d.color.length === 2) {
            return `url(#gradient)`;
          } else {
            return d.color[0];
          }
        });

        if (type !== "c") {
          const childPath = d3.select(childRef.current).selectAll("path");
          childPath.attr("stroke", function (d, i) {
            if (d.color.length === 2) {
              return `url(#gradient)`;
            } else {
              return d.color[0];
            }
          });
        } else {
          const momPath = d3.select(momRef.current).selectAll("path");
          const dadPath = d3.select(dadRef.current).selectAll("path");

          momPath.attr("stroke", (d) => d.color[0]);
          dadPath.attr("stroke", (d) => d.color[0]);
        }
      });
  }

  useEffect(() => {
    if (mom !== "" && dad !== "" && child !== "") {
      const momData = preprocessData(relMap, mom);
      const dadData = preprocessData(relMap, dad);
      const childData = preprocessData(relMap, child);

      addColor(momData, dadData, childData);

      drawGraph(momRef, momData, "m");
      drawGraph(dadRef, dadData, "d");
      drawGraph(childRef, childData, "c");
    }
  }, [mom, dad, child]);

  return (
    <>
      <div className="px-4 pt-2">
        <p className="text-ebsm">Edge Recombination Crossover</p>
      </div>
      {mom && dad && child ? (
        <div>
          <div className="flex justify-center justify-items-center items-center">
            <svg ref={momRef} width={width / 2} height={height / 2} />
            <h1 className="erx-sign mx-2">+</h1>
            <svg ref={dadRef} width={width / 2} height={height / 2} />
          </div>
          <div
            style={{ width: `${width}px`, height: `20px` }}
            className="erx-sign flex justify-center items-center mb-4"
          >
            =
          </div>
          <div className="flex justify-center justify-items-center items-center">
            <svg ref={childRef} width={width} height={height / 2} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[500px]">
          <span className="text-bsm">
            Choose a gene to <br /> see the ERX process.
          </span>
        </div>
      )}
    </>
  );
};

export default EdgeRecomb;
