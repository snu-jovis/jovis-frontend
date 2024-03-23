import { useEffect, useState, useRef, useContext } from "react";
import * as d3 from "d3";
import { sliderHorizontal, sliderVertical } from "d3-simple-slider";
import data from "../../data/geqo.json";
import "../../assets/stylesheets/GeneticAlgo.css";
import { GeqoContext } from "../../contexts/GeqoContext";

const GeneticAlgo = () => {
  const geqoData = data.optimizer.geqo.gen;
  const numGen = geqoData.length;
  const numGene = geqoData[0].pool.length;

  const { setRelMap, setChosen, setMom, setDad, setChild } =
    useContext(GeqoContext);

  setRelMap(data.optimizer.geqo.map);

  const [isRecomb, setIsRecomb] = useState(false);

  const [selectedGen, setSelectedGen] = useState([0, numGen]);
  const [selectedGene, setSelectedGene] = useState([0, numGene]);

  const genRef = useRef(null);
  const horizRef = useRef(null);
  const vertRef = useRef(null);

  const width = 800;
  const height = 800;
  const margin = { x: 0, y: 0 };

  const [rectWidth, setRectWidth] = useState((width - 2 * margin.x) / numGen);
  const [rectHeight, setRectHeight] = useState(
    (height - 2 * margin.y) / numGene
  );

  const minFitness = d3.min(geqoData, (d) => d3.min(d.pool, (p) => p.fitness));
  const maxFitness = d3.max(geqoData, (d) => d3.max(d.pool, (p) => p.fitness));

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
      setChild(gene.gene);
    }
  };

  useEffect(() => {
    setRectWidth((width - 2 * margin.x) / (selectedGen[1] - selectedGen[0]));
    setRectHeight(
      (height - 2 * margin.y) / (selectedGene[1] - selectedGene[0])
    );

    const svg = d3.select(genRef.current);
    svg.selectAll("*").remove(); // clear

    const filteredGen = geqoData.filter(
      (gen, i) => i >= selectedGen[0] && i <= selectedGen[1]
    );

    if (filteredGen.length < 40) {
      setIsRecomb(true);
    } else {
      setIsRecomb(false);
    }

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
          .attr("x", i * rectWidth)
          .attr("y", j * rectHeight)
          .attr("width", isRecomb ? rectWidth / 2 : rectWidth)
          .attr("height", rectHeight)
          .attr("fill", gene.color)
          // .attr("fill", function () {
          //   if (gene.parents) return gene.color;
          //   else return "ghostwhite";
          // })
          .attr("stroke", "lightgrey")
          .attr("stroke-width", 0.1)
          .attr("transform", `translate(${margin.x},${margin.y})`)
          .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", d3.rgb(gene.color).darker());

            tooltip
              .html(
                `Gen num: ${gen.gen_num}<br>Pop num: ${gene.population_num}<br>Gene: ${gene.gene}<br>Fitness: ${gene.fitness}`
              )
              .style("visibility", "visible");
          })
          .on("mousemove", function (event) {
            tooltip
              .style("top", event.pageY - 50 + "px")
              .style("left", event.pageX + 10 + "px");
          })
          .on("mouseout", function () {
            d3.select(this).attr("fill", gene.color);

            tooltip.html(``).style("visibility", "hidden");
          });

        rect.on("click", (event, d) => {
          handleClick(i, gene);
        });

        if (isRecomb) {
          if (gene.parents) {
            // rect.attr("stroke", "black").attr("stroke-width", 1);

            svg
              .append("line")
              .attr("x1", (i - 1) * rectWidth + rectWidth / 2)
              .attr("y1", gene.parents[0] * rectHeight + rectHeight / 2)
              .attr("x2", (i - 1) * rectWidth + rectWidth)
              .attr("y2", j * rectHeight + rectHeight / 2)
              .attr("stroke", "red");
            svg
              .append("line")
              .attr("x1", (i - 1) * rectWidth + rectWidth / 2)
              .attr("y1", gene.parents[1] * rectHeight + rectHeight / 2)
              .attr("x2", (i - 1) * rectWidth + rectWidth)
              .attr("y2", j * rectHeight + rectHeight / 2)
              .attr("stroke", "blue");
          }
        }
      });
    });
  }, [geqoData, selectedGen, selectedGene]);

  useEffect(() => {
    const horizSvg = d3.select(horizRef.current);
    var horizSlider = sliderHorizontal()
      .min(selectedGen[0])
      .max(selectedGen[1])
      .step(1)
      .default(selectedGen)
      .fill("grey")
      .width(width)
      .on("onchange", (val) => {
        setSelectedGen(val);
      });

    var hRange = horizSvg.append("g").attr("transform", `translate(20, 0)`);
    hRange.call(horizSlider);

    const vertSvg = d3.select(vertRef.current);
    var vertSlider = sliderVertical()
      .min(selectedGene[0])
      .max(selectedGene[1])
      .step(1)
      .default(selectedGene)
      .fill("grey")
      .height(height)
      .on("onchange", (val) => {
        setSelectedGene([numGene - val[1], numGene - val[0]]);
      });

    var vRange = vertSvg.append("g").attr("transform", `translate(50, 0)`);
    vRange.call(vertSlider);
  }, []);

  return (
    <div>
      <div className="flex">
        <svg className="vert-slider" ref={vertRef} width={50} height={height} />
        <svg ref={genRef} width={width} height={height} />
      </div>
      <svg className="horiz-slider" ref={horizRef} width={width} height={50} />
    </div>
  );
};

export default GeneticAlgo;
