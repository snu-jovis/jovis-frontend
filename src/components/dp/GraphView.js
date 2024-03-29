import React, { useEffect, useState, useRef } from 'react';
import { parseDp, parseOptimalOne } from './parseDp';
import { sliderHorizontal } from 'd3-simple-slider';
import * as d3 from 'd3';
import * as d3dag from 'https://cdn.skypack.dev/d3-dag@1.0.0-1';
import { Checkbox, slider } from '@material-tailwind/react';

import '../../assets/stylesheets/Dp.css';

const GraphView = ({ width, height, data }) => {
    const dagSvg = useRef(null);
    const sliderRef = useRef(null);
    const sliderWidth = 300;
    const sliderHeight = 50;

    const target = data.optimizer.dp[data.optimizer.dp.length - 1];
    const totalCost = target.cheapest_total_paths.total_cost;
    const margin = { x: 0, y: 20 };

    const [showOptimalOne, setShowOptimalOne] = useState(false);
    const handleCheckboxChange = () => {
        setShowOptimalOne(prev => !prev);
    };

    function drawSlider({ sliderSvg, data }) {
        d3.select(sliderSvg.current).selectAll('*').remove(); //clear

        var moving = false;
        var currentValue = 0;
        var interval;

        const levelDepth = data[data.length - 1].level;
        const tickVale = d3.range(0, (levelDepth + 1) / 2);
        const maxSliderValue = (levelDepth + 1) / 2;
        const svg = d3.select(sliderSvg.current);

        // create slider
        var slider = sliderHorizontal()
            .min(1)
            .max(maxSliderValue)
            .step(1)
            .width(sliderWidth)
            .tickValues(tickVale)
            .default(0)
            .on('onchange', val => {
                currentValue = val;
                console.log('Slider value: ', val);
                updateTotalCost(val);
            });

        var sliderRange = svg.append('g');

        sliderRange.call(slider);

        // play/pause button
        var playButton = d3.select('#play-button');

        playButton.on('click', function () {
            var button = d3.select(this);
            if (moving) {
                clearInterval(interval);
                moving = false;
                button.text('Play');
            } else {
                moving = true;
                button.text('Pause');
                interval = setInterval(function () {
                    currentValue = currentValue < maxSliderValue ? currentValue + 1 : 0;
                    slider.value(currentValue);
                    if (currentValue === maxSliderValue) {
                        clearInterval(interval);
                        moving = false;
                        playButton.text('Play');
                    }
                }, 1000);
            }
        });

        function updateTotalCost(sliderValue) {
            const level = (sliderValue - 1) * 2;
            const filteredData = data.filter(d => d.level === level);
            filteredData.forEach((d, i) => {
                svg.append('text')
                    .attr('class', 'total-cost-text')
                    .attr('x', 10)
                    .attr('y', 20 + i * 20)
                    .text(`Level ${d.level} total cost: ${d.total_cost}`);
            });
        }
    }

    function drawGraph({ graphSvg, data }) {
        d3.select(graphSvg.current).selectAll('*').remove(); //clear

        // data graph 형태로 변경
        const graph = d3dag.graphStratify()(data);

        /* coumput layout */
        const nodeRadius = 25;
        const nodeSize = [nodeRadius * 2, nodeRadius * 2];
        const dagDepth = data[data.length - 1].level;

        const layout = d3dag
            .sugiyama()
            .nodeSize(node => {
                if (node.data.id.includes(' - ')) {
                    return [150, 150];
                } else {
                    return [50, 50];
                }
            })
            .gap([20, 20]);
        // .tweaks([shape]);

        const { width: dagWidth, height: dagHeight } = layout(graph);

        const svg = d3
            .select(graphSvg.current)
            .append('svg')
            .attr('width', dagWidth)
            .attr('height', dagHeight)
            .append('g') // 그룹으로 묶어서
            .attr('transform', `scale(${width / dagWidth}, ${width / dagWidth})`)
            .call(
                d3.zoom().on('zoom', event => {
                    svg.attr('transform', event.transform);
                })
            )
            .append('g');

        // create links
        const line = d3.line().curve(d3.curveMonotoneY);
        const links = svg
            .append('g')
            .selectAll('path')
            .data(graph.links())
            .enter()
            .append('path')
            .attr('d', d =>
                line([
                    [d.source.x, d.source.data.level * (dagHeight / dagDepth) + nodeRadius / 2],
                    [d.target.x, d.target.data.level * (dagHeight / dagDepth) - nodeRadius / 2],
                ])
            )
            .attr('transform', `translate(0, ${margin.y})`)
            .attr('fill', 'none')
            .attr('stroke-width', 3)
            .attr('stroke', 'lightgrey');

        // create nodes
        const nodes = svg
            .append('g')
            .selectAll('g')
            .data(graph.nodes())
            .enter()
            .append('g')
            .attr('transform', d => {
                return `translate(${d.x}, ${d.data.level * (dagHeight / dagDepth) + margin.y})`;
            });

        // // create arrows
        // const arrowSize = (nodeRadius * nodeRadius) / 20.0;
        // const arrowLen = Math.sqrt((4 * arrowSize) / Math.sqrt(3));
        // const arrow = d3.symbol().type(d3.symbolTriangle).size(arrowSize);

        // svg
        //   .append("g")
        //   .selectAll("path")
        //   .data(graph.links())
        //   .enter()
        //   .append("path")
        //   .attr("d", arrow)
        //   .attr("transform", ({ points }) => {
        //     const [[sx, sy], [ex, ey]] = points.slice(-2);
        //     const dx = sx - ex;
        //     const dy = sy - ey;
        //     // This is the angle of the last line segment
        //     const angle = (Math.atan2(-dy, -dx) * 180) / Math.PI + 90;
        //     return `translate(${ex}, ${ey}) rotate(${angle})`;
        //   })
        //   .attr("fill", ({ target }) => colorMap[target.data.id])
        //   .attr("stroke", "white")
        //   .attr("stroke-width", 1.5)
        //   .attr("stroke-dasharray", `${arrowLen},${arrowLen}`);

        const colorMap = new Map();
        const nodesArray = Array.from(graph.nodes());

        const nodeTypes = [
            ...new Set(
                nodesArray.map(node => {
                    return node.data.id.split(' - ')[1];
                })
            ),
        ];

        nodeTypes.forEach((type, i) => {
            colorMap.set(type, d3.schemePastel1[i]);
        });

        nodes.each(function (d) {
            const node = d3.select(this);
            const parts = d.data.id.split(' - ');

            if (parts.length > 1) {
                node.append('rect')
                    .attr('id', d => d.data.id.replace(/\s/g, ''))
                    .attr('width', d.data.id.length * 6 + 20)
                    .attr('height', 50)
                    .attr('x', -d.data.id.length * 3 - 10)
                    .attr('y', -15)
                    .attr('fill', colorMap.get(parts[1]));
            } else {
                node.append('circle').attr('r', nodeRadius).attr('fill', colorMap.get(nodeTypes[0]));
            }
        });

        // node type
        nodes
            .append('text')
            .text(d => d.data.id.split(' - ').pop())
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('class', 'dp-node-text');

        const tooltip = d3.select('body').append('div').attr('class', 'dp-tooltip').style('visibility', 'hidden');

        nodes
            .on('mouseover', function (event, d) {
                tooltip.html(`${d.data.id} level: ${d.data.level}`).style('visibility', 'visible');
            })
            .on('mousemove', function (event) {
                tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
            })
            .on('mouseout', function () {
                tooltip.style('visibility', 'hidden');
            });

        /* ANIMATION */
        nodes.style('opacity', '0');
        links.style('opacity', '0');

        function animate(level) {
            if (level > dagDepth) return;

            var cheapestId = [];
            nodes
                .filter(function (d) {
                    return d.data.level === level + 1;
                })
                .each(function (d) {
                    cheapestId.push(
                        `${d.data.nodeData.cheapest_total_paths.relid} - ${d.data.nodeData.cheapest_total_paths.node}`.replace(
                            /\s/g,
                            ''
                        )
                    );
                });

            // First transition: Make nodes with d.data.level <= level + 1 appear
            nodes
                .filter(function (d) {
                    return d.data.level <= level + 1 && d.data.level > level - 1;
                })
                .transition()
                .duration(10)
                .style('opacity', 1);

            links
                .filter(function (d) {
                    return d.target.data.level === level + 1 || d.target.data.level === level;
                })
                .transition()
                .duration(10)
                .style('opacity', 1)
                .end()
                .then(() => {
                    // Second transition: Make nodes with d.data.level === level and id !== cheapestId disappear
                    nodes
                        .filter(function (d) {
                            return d.data.level === level && !cheapestId.includes(`${d.data.id.replace(/\s/g, '')}`);
                        })
                        .transition()
                        .duration(10)
                        .style('opacity', 0);

                    links
                        .filter(function (d) {
                            return (
                                (d.source.data.level === 1 && d.target.data.level !== 2) ||
                                (d.target.data.level === level &&
                                    !cheapestId.includes(`${d.target.data.id.replace(/\s/g, '')}`)) ||
                                (d.target.data.level === level + 1 &&
                                    !cheapestId.includes(`${d.source.data.id.replace(/\s/g, '')}`))
                            );
                        })
                        .transition()
                        .duration(10)
                        .style('opacity', 0)
                        .end()
                        .then(() => {
                            animate(level + 2);
                        });
                });
        }

        // Start the animation with level 0
        animate(0);
    }

    useEffect(() => {
        const dpData = parseDp(data);
        const optimalData = parseOptimalOne(data);

        if (showOptimalOne)
            drawGraph({
                graphSvg: dagSvg,
                data: optimalData,
            });
        else
            drawGraph({
                graphSvg: dagSvg,
                data: dpData,
            });
    }, [data, width, height, showOptimalOne]);

    useEffect(() => {
        const dpData = parseDp(data);
        drawSlider({
            sliderSvg: sliderRef,
            data: dpData,
        });
    }, [sliderRef]);

    return (
        <div>
            <p className='dp-text'>Total Cost: {totalCost}</p>
            <div className='flex justify-center flex-container'>
                <button className='dp-text' id='play-button'>
                    Play
                </button>
                <svg className='slider' ref={sliderRef} width={sliderWidth} height={sliderHeight} />
            </div>
            <svg ref={dagSvg} width={width} height={height + 2 * margin.y}></svg>
            <div className='checkbox-container'>
                <Checkbox
                    color='blue'
                    className='h-4 w-4 rounded-full border-gray-900/20 bg-gray-900/10 transition-all hover:scale-105 hover:before:opacity-0'
                    checked={showOptimalOne}
                    label={<p className='text'>Show Optimized One</p>}
                    onClick={handleCheckboxChange}
                />
            </div>
        </div>
    );
};

export default GraphView;
