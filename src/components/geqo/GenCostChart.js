import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import data from "../../data/geqo.json";
import "../../assets/stylesheets/GenCostChart.css";

const GenCostChart = (props) => {
  const geqoData = data.optimizer.geqo.gen;

  const lineplotSvg = useRef(null);

  const width = 400;
  const height = 400;
  const margin = 50;

  const legendWidth = width / 4;
  const legendItemSize = 10;
  const legendMargin = 5;

  const metrics = useMemo(() => ["best", "worst", "mean", "avg"], []);
  const colors = ["blue", "red", "orange", "purple"];
  const lineColor = d3.scaleOrdinal().domain(metrics).range(colors);

  const dataMargin =
    (d3.max(geqoData, (d) => d.worst) - d3.min(geqoData, (d) => d.best)) / 5;

  // create scales for x and y
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(geqoData, (d) => d.gen_num),
      d3.max(geqoData, (d) => d.gen_num),
    ])
    .range([margin, width - margin]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(geqoData, (d) => d.best - dataMargin),
      d3.max(geqoData, (d) => d.worst + dataMargin),
    ])
    .range([height - margin, margin]);

  useEffect(() => {
    const svg = d3.select(lineplotSvg.current);
    svg.selectAll("*").remove(); // clear

    // draw x and y axes
    svg
      .append("g")
      .attr("id", "xAxis")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${margin}, 0)`)
      .call(d3.axisLeft(yScale));

    // add x and y axis labels
    svg
      .append("text")
      .attr("class", "x-label")
      .attr("transform", `translate(${width / 2}, ${height - margin / 3})`)
      .style("text-anchor", "middle")
      .text("Generation");

    svg
      .append("text")
      .attr("class", "y-label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Cost");

    // draw line for best, worst, mean, and average
    metrics.forEach((metric, i) => {
      svg
        .append("path")
        .attr("id", `line-${metric}`)
        .datum(geqoData)
        .attr("stroke-width", 1.5)
        .attr("fill", "none")
        .attr("stroke", (d) => lineColor(metric))
        .attr(
          "d",
          d3
            .line()
            .x((d) => xScale(d.gen_num))
            .y((d) => yScale(d[metric]))
        );
    });

    // draw legend
    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - legendWidth}, ${margin + legendMargin})`
      );

    metrics.forEach((metric, i) => {
      const legendItem = legend
        .append("g")
        .attr(
          "transform",
          `translate(0, ${i * (legendItemSize + legendMargin)})`
        );

      legendItem
        .append("rect")
        .attr("width", legendItemSize)
        .attr("height", legendItemSize)
        .style("fill", (d) => lineColor(metric));

      legendItem
        .append("text")
        .attr("class", "legend-label")
        .attr("x", legendItemSize + legendMargin)
        .attr("y", legendItemSize - legendMargin)
        .text(metric);
    });
  }, [
    geqoData,
    metrics,
    margin,
    width,
    xScale,
    yScale,
    lineColor,
    legendWidth,
  ]);

  return (
    <div>
      <svg ref={lineplotSvg} width={width} height={height}></svg>
    </div>
  );
};

export default GenCostChart;
