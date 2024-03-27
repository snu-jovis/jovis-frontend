import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import data from "../../data/geqo.json";
import { Checkbox } from "@material-tailwind/react";

const CostChart = ({ width, height }) => {
  const geqoData = data.optimizer.geqo.gen; // TODO

  const [logScale, setLogScale] = useState(false);
  const handleCheckboxChange = () => {
    setLogScale((prev) => !prev);
  };

  const metrics = ["best", "worst", "mean", "avg"];
  const [selectedMetric, setSelectedMetric] = useState(null);
  const metricNames = {
    best: "best",
    worst: "worst",
    mean: "median",
    avg: "average",
  };

  const legendSvg = useRef(null);
  const legendWidth = 230;
  const legendHeight = 20;
  const legendMargin = { x: 25, y: 6, r: 5 };

  const chartSvg = useRef(null);
  const chartHeight = height - legendHeight;
  const chartMargin = { top: 10, right: 40, bottom: 20, left: 50 };

  const lineColor = d3
    .scaleOrdinal()
    .domain(metrics)
    .range(d3.schemeCategory10);

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(geqoData, (d) => d.gen_num),
      d3.max(geqoData, (d) => d.gen_num),
    ])
    .range([chartMargin.left, width - chartMargin.right]);

  const drawAxes = (svg, xScale, yScale) => {
    svg
      .append("g")
      .attr("id", "xAxis")
      .attr("transform", `translate(0, ${chartHeight - chartMargin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("id", "yAxis")
      .attr("transform", `translate(${chartMargin.left}, 0)`)
      .call(d3.axisLeft(yScale).tickFormat(d3.format("d")));
  };

  const drawLines = (svg, xScale, yScale) => {
    metrics.forEach((metric) => {
      svg
        .append("path")
        .attr("id", `line-${metric}`)
        .datum(geqoData)
        .transition()
        .duration(500)
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("stroke", lineColor(metric))
        .attr(
          "d",
          d3
            .line()
            .x((d) => xScale(d.gen_num))
            .y((d) => yScale(d[metric]))
        );
    });
  };

  const drawLegend = (svg) => {
    const legend = svg.append("g");

    let textWidth = 0,
      prevPosX = legendMargin.r;

    metrics.forEach((metric) => {
      const legendItem = legend
        .append("g")
        .attr(
          "transform",
          `translate(${prevPosX + textWidth}, ${legendMargin.y})`
        )
        .attr("class", "cursor-pointer")
        .on("click", function () {
          if (selectedMetric === metric) setSelectedMetric(null);
          else setSelectedMetric(metric);
        });

      legendItem
        .append("circle")
        .attr("r", legendMargin.r)
        .attr("transform", `translate(0, ${legendMargin.r})`)
        .style(
          "fill",
          selectedMetric
            ? selectedMetric === metric
              ? lineColor(metric)
              : "lightgray"
            : lineColor(metric)
        );

      const legendText = legendItem
        .append("text")
        .attr("class", "font-thin text-xs")
        .attr("x", legendMargin.r * 2)
        .attr("y", legendMargin.y + legendMargin.r / 2)
        .text(metricNames[metric]);

      prevPosX += textWidth;
      textWidth = legendText.node().getBBox().width + legendMargin.x;
    });
  };

  /* initialize the line chart */
  useEffect(() => {
    const svg = d3.select(chartSvg.current);
    svg.selectAll("*").remove(); // clear

    const dataMargin =
      (d3.max(geqoData, (d) => d.worst) - d3.min(geqoData, (d) => d.best)) / 5;

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(geqoData, (d) => d.best - dataMargin),
        d3.max(geqoData, (d) => d.worst + dataMargin),
      ])
      .range([chartHeight - chartMargin.bottom, chartMargin.top]);

    drawAxes(svg, xScale, yScale);
    drawLines(svg, xScale, yScale);
  }, [width, height, geqoData]);

  /* draw legend */
  useEffect(() => {
    const svg = d3.select(legendSvg.current);
    svg.selectAll("*").remove(); // clear

    drawLegend(svg);
  }, [geqoData, selectedMetric]);

  /* update when metric is selected */
  useEffect(() => {
    const svg = d3.select(chartSvg.current);

    const dataMargin =
      (d3.max(geqoData, (d) => (selectedMetric ? d[selectedMetric] : d.worst)) -
        d3.min(geqoData, (d) =>
          selectedMetric ? d[selectedMetric] : d.best
        )) /
      5;

    const yScale = logScale
      ? d3
          .scaleLog()
          .domain([
            d3.min(geqoData, (d) =>
              selectedMetric
                ? d[selectedMetric] - dataMargin
                : d.best - dataMargin
            ),
            d3.max(geqoData, (d) =>
              selectedMetric
                ? d[selectedMetric] + dataMargin
                : d.worst + dataMargin
            ),
          ])
          .range([chartHeight - chartMargin.bottom, chartMargin.top])
      : d3
          .scaleLinear()
          .domain([
            d3.min(geqoData, (d) =>
              selectedMetric
                ? d[selectedMetric] - dataMargin
                : d.best - dataMargin
            ),
            d3.max(geqoData, (d) =>
              selectedMetric
                ? d[selectedMetric] + dataMargin
                : d.worst + dataMargin
            ),
          ])
          .range([chartHeight - chartMargin.bottom, chartMargin.top]);

    svg
      .select("#yAxis")
      .transition()
      .duration(500)
      .call(d3.axisLeft(yScale).tickFormat(d3.format("d")));

    metrics.forEach((metric) => {
      if (!selectedMetric || selectedMetric === metric) {
        svg
          .select(`#line-${metric}`)
          .datum(geqoData)
          .transition()
          .duration(500)
          .style("opacity", 1)
          .attr(
            "d",
            d3
              .line()
              .x((d) => xScale(d.gen_num))
              .y((d) => yScale(d[metric]))
          );
      } else svg.select(`#line-${metric}`).style("opacity", 0);
    });
  }, [selectedMetric, logScale]);

  useEffect(() => {
    const svg = d3.select(chartSvg.current);

    const dataMargin =
      (d3.max(geqoData, (d) => (selectedMetric ? d[selectedMetric] : d.worst)) -
        d3.min(geqoData, (d) =>
          selectedMetric ? d[selectedMetric] : d.best
        )) /
      5;

    const yScale = logScale
      ? d3
          .scaleLog()
          .domain([
            d3.min(geqoData, (d) =>
              selectedMetric
                ? d[selectedMetric] - dataMargin
                : d.best - dataMargin
            ),
            d3.max(geqoData, (d) =>
              selectedMetric
                ? d[selectedMetric] + dataMargin
                : d.worst + dataMargin
            ),
          ])
          .range([chartHeight - chartMargin.bottom, chartMargin.top])
      : d3
          .scaleLinear()
          .domain([
            d3.min(geqoData, (d) =>
              selectedMetric
                ? d[selectedMetric] - dataMargin
                : d.best - dataMargin
            ),
            d3.max(geqoData, (d) =>
              selectedMetric
                ? d[selectedMetric] + dataMargin
                : d.worst + dataMargin
            ),
          ])
          .range([chartHeight - chartMargin.bottom, chartMargin.top]);

    const bisect = d3.bisector((d) => d.gen_num).left;

    const focusLine = svg
      .append("line")
      .attr("stroke", "gray")
      .attr("stroke-width", 1);

    const focusText = svg.append("text").attr("text-anchor", "middle");

    metrics.forEach((metric) => {
      svg
        .append("circle")
        .attr("id", `focus-circle-${metric}`)
        .style("fill", lineColor(metric))
        .style("opacity", 0)
        .attr("r", 3);

      svg
        .append("text")
        .attr("id", `focus-text-${metric}`)
        .attr("text-anchor", "middle");
    });

    svg
      .append("rect")
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("width", width)
      .attr("height", chartHeight)
      .on("mouseover", function () {
        focusLine.style("opacity", 1);
        focusText.style("opacity", 1);
        metrics.forEach((metric) => {
          if (!selectedMetric || selectedMetric === metric) {
            svg.select(`#focus-circle-${metric}`).style("opacity", 1);
            svg.select(`#focus-text-${metric}`).style("opacity", 1);
          }
        });
      })
      .on("mousemove", function (event) {
        const x0 = xScale.invert(d3.pointer(event, this)[0]);
        const i = bisect(geqoData, x0, 1);
        const focused = geqoData[i - 1];

        focusLine
          .attr("x1", xScale(focused.gen_num))
          .attr("y1", chartMargin.top + 15)
          .attr("x2", xScale(focused.gen_num))
          .attr("y2", chartHeight - chartMargin.bottom);

        focusText
          .attr("x", xScale(focused.gen_num))
          .attr("y", chartMargin.top + 10)
          .attr("class", "focus-gen")
          .text(`Generation ${focused.gen_num}`);

        metrics.forEach((metric) => {
          if (!selectedMetric || selectedMetric === metric) {
            svg
              .select(`#focus-circle-${metric}`)
              .attr("cx", xScale(focused.gen_num))
              .attr("cy", yScale(focused[metric]));

            svg
              .select(`#focus-text-${metric}`)
              .attr("x", xScale(focused.gen_num))
              .attr(
                "y",
                metric === "best" || metric === "mean"
                  ? yScale(focused[metric]) + 15
                  : yScale(focused[metric]) - 10
              )
              .attr("class", "focus-cost")
              .text(Math.round(focused[metric]));
          }
        });
      })
      .on("mouseout", function () {
        focusLine.style("opacity", 0);
        focusText.style("opacity", 0);
        metrics.forEach((metric) => {
          svg.select(`#focus-circle-${metric}`).style("opacity", 0);
          svg.select(`#focus-text-${metric}`).style("opacity", 0);
        });
      });
  });

  return (
    <div>
      <div className="flex justify-between px-4 pt-2">
        <p className="vis-title pt-2">Cost</p>
        <Checkbox
          className="h-4 w-4 rounded-full border-gray-900/20 bg-gray-900/10 transition-all hover:scale-105 hover:before:opacity-0"
          checked={logScale}
          label={<p className="text">Log Scale</p>}
          onClick={handleCheckboxChange}
        />
      </div>
      <svg ref={chartSvg} width={width} height={chartHeight} />
      <div className="flex justify-center py-2">
        <svg ref={legendSvg} width={legendWidth} height={legendHeight} />
      </div>
    </div>
  );
};

export default CostChart;
