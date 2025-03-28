import { useEffect, useState, useRef, useContext, useMemo } from "react";
import * as d3 from "d3";
import { sliderHorizontal, sliderVertical } from "d3-simple-slider";
import { GeqoContext } from "../providers/GeqoProvider";

const FullView = ({ width, height, data: geqoData }) => {
  const { setChosen, setMom, setDad } = useContext(GeqoContext);

  const svgWidth = width;
  const svgHeight = height;
  const sliderSize = 80;
  const sliderMargin = 10;

  const numGen = geqoData.length;
  const numGene = geqoData[0].pool.length;

  const [showRecomb, setShowRecomb] = useState(false);
  const [selectedGen, setSelectedGen] = useState([0, numGen]);
  const [selectedGene, setSelectedGene] = useState([0, numGene]);

  const genRef = useRef(null);
  const horizRef = useRef(null);
  const vertRef = useRef(null);

  const [rectWidth, setRectWidth] = useState(svgWidth / numGen);
  const [rectHeight, setRectHeight] = useState(svgHeight / numGene);

  const minFitness = geqoData[0].worst;
  const maxFitness = geqoData[numGen - 1].best;

  // create a color interpolator
  const colorScale = d3
    .scaleSequential()
    .domain([minFitness, maxFitness])
    .interpolator(d3.interpolateCool);

  // set the color column by using the color interpolator
  geqoData.forEach((gen) => {
    gen.pool.forEach((gene) => {
      gene.color = colorScale(gene.fitness);
    });
  });

  const handleClick = (gen, gene) => {
    setChosen(gene.gene);

    if (gene.parents) {
      setMom(geqoData[gen - 1].pool[gene.parents[0]].gene);
      setDad(geqoData[gen - 1].pool[gene.parents[1]].gene);
    } else {
      setMom("");
      setDad("");
    }
  };

  useEffect(() => {
    const filteredGen = geqoData.filter(
      (gen, i) => i >= selectedGen[0] && i <= selectedGen[1]
    );

    if (filteredGen.length < 30) setShowRecomb(true);
    else setShowRecomb(false);

    const svg = d3.select(genRef.current);
    svg.selectAll("*").remove(); // clear

    setRectWidth(svgWidth / (selectedGen[1] - selectedGen[0] + 1));
    setRectHeight(svgHeight / (selectedGene[1] - selectedGene[0]));

    filteredGen.forEach((gen, i) => {
      const filteredGene = gen.pool.filter(
        (gene, i) => i >= selectedGene[0] && i <= selectedGene[1]
      );

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "gene-tooltip");

      filteredGene.forEach((gene, j) => {
        const rect = svg
          .append("rect")
          .attr("id", `gene-${gen.gen_num}-${gene.population_num}`)
          .attr("x", i * rectWidth)
          .attr("y", j * rectHeight)
          .attr("width", showRecomb ? rectWidth / 2 : rectWidth)
          .attr("height", rectHeight)
          .attr("fill", gene.color)
          .attr("stroke", "lightgray")
          .attr("stroke-width", 0.1)
          .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", d3.rgb(gene.color).darker());
            tooltip
              .html(
                `Generation: ${gen.gen_num + 1}<br>Population: ${
                  gene.population_num
                }<br>Fitness: ${gene.fitness}`
              )
              .style("visibility", "visible");
          })
          .on("mousemove", function (event) {
            tooltip
              .style("top", event.pageY - 10 + "px")
              .style("left", event.pageX + 10 + "px");
          })
          .on("mouseout", function () {
            d3.select(this).attr("fill", gene.color);
            tooltip.html(``).style("visibility", "hidden");
          });

        rect.on("click", (event, d) => {
          tooltip.html(``).style("visibility", "hidden");
          handleClick(selectedGen[0] + i, gene);
        });

        if (showRecomb) {
          if (gene.parents) {
            svg
              .append("line")
              .attr("x1", (i - 1) * rectWidth + rectWidth / 2)
              .attr("y1", gene.parents[0] * rectHeight + rectHeight / 2)
              .attr("x2", (i - 1) * rectWidth + rectWidth / 2)
              .attr("y2", gene.parents[0] * rectHeight + rectHeight / 2)
              .transition()
              .duration(1000)
              .attr("x2", (i - 1) * rectWidth + rectWidth)
              .attr("y2", j * rectHeight + rectHeight / 2)
              .attr(
                "stroke",
                geqoData[selectedGen[0] + i - 1].pool[gene.parents[0]].color
              )
              .attr("stroke-width", 2.5);

            svg
              .append("line")
              .attr("x1", (i - 1) * rectWidth + rectWidth / 2)
              .attr("y1", gene.parents[1] * rectHeight + rectHeight / 2)
              .attr("x2", (i - 1) * rectWidth + rectWidth / 2)
              .attr("y2", gene.parents[1] * rectHeight + rectHeight / 2)
              .transition()
              .duration(1000)
              .attr("x2", (i - 1) * rectWidth + rectWidth)
              .attr("y2", j * rectHeight + rectHeight / 2)
              .attr(
                "stroke",
                geqoData[selectedGen[0] + i - 1].pool[gene.parents[1]].color
              )
              .attr("stroke-width", 2);
          }
        }
      });
    });
  }, [
    width,
    height,
    geqoData,
    rectHeight,
    rectWidth,
    selectedGen,
    selectedGene,
  ]);

  // range slider
  useEffect(() => {
    const horizSvg = d3.select(horizRef.current);
    horizSvg.selectAll("*").remove(); // clear

    var horizSlider = sliderHorizontal()
      .min(0)
      .max(numGen - 1)
      .step(1)
      .default(selectedGen)
      .fill("gray")
      .width(svgWidth)
      .on("end", (val) => {
        setSelectedGen(val);
      });

    var hRange = horizSvg
      .append("g")
      .attr(
        "transform",
        `translate(${sliderSize + sliderMargin * 2}, ${sliderMargin / 2})`
      );
    hRange.call(horizSlider);

    const vertSvg = d3.select(vertRef.current);
    vertSvg.selectAll("*").remove(); // clear

    var vertSlider = sliderVertical()
      .min(0)
      .max(numGene)
      .step(1)
      .default(selectedGene)
      .fill("gray")
      .height(svgHeight)
      .on("end", (val) => {
        setSelectedGene([numGene - val[1], numGene - val[0]]);
      });

    var vRange = vertSvg
      .append("g")
      .attr("transform", `translate(${sliderSize - sliderMargin * 2}, 20)`);
    vRange.call(vertSlider);
  }, [width, height, geqoData]);

  return (
    <div className="place-content-center mr-8">
      <div className="flex items-center place-content-center">
        <svg
          className="vert-slider"
          ref={vertRef}
          width={sliderSize}
          height={svgHeight + 2 * sliderMargin + 20}
        />
        <svg ref={genRef} width={svgWidth} height={svgHeight} />
      </div>
      <div className="flex items-center place-content-center justify-center">
        <svg
          className="horiz-slider"
          ref={horizRef}
          width={svgWidth + 2 * sliderMargin + 100}
          height={sliderSize}
        />
      </div>
    </div>
  );
};

export default FullView;
