import React, { useEffect, useState, useRef } from 'react';
import { parseDp, parseOptimal } from './parseDp';
import { sliderHorizontal } from 'd3-simple-slider';
import * as d3 from 'd3';
import * as d3dag from 'https://cdn.skypack.dev/d3-dag@1.0.0-1';
import { Checkbox, Card } from '@material-tailwind/react';

import '../../assets/stylesheets/Dp.css';

const GraphView = ({ width, height, data }) => {
    const dagSvg = useRef(null);
    const svgWidth = width;
    const svgHeight = height - 80;

    const sliderRef = useRef(null);
    const sliderWidth = 300;
    const sliderHeight = 50;
    const sliderMargin = 10;

    const [moving, setMoving] = useState(false);
    const [currLevel, setCurrLevel] = useState(1);

    const margin = { x: 0, y: 20 };

    const [showOptimalOne, setShowOptimalOne] = useState(false);
    const [totalCost, setTotalCost] = useState(0);

    const cheapstTotalCost = data.optimizer.dp[data.optimizer.dp.length - 1].cheapest_total_paths.total_cost;

    const handleCheckboxChange = () => {
        setShowOptimalOne(prev => !prev);
    };

    function mapName(name) {
        switch (name) {
            case 'SeqScan':
                return 'Seq\nScan';
            case 'HashJoin':
                return 'Hash\nJoin';
            case 'MergeJoin':
                return 'Merge\nJoin';
            case 'NestLoop':
                return 'Nested\nLoop';
            case 'IdxScan':
                return 'Index\nScan';
            default:
                return name;
        }
    }

    function drawSlider({ data }) {
        const sliderSvg = d3.select(sliderRef.current);
        sliderSvg.selectAll('*').remove(); //clear

        var interval;

        const maxLevel = Math.ceil((data[data.length - 1].level + 1) / 2);
        const tickValue = d3.range(1, maxLevel + 1);

        var playButton = d3.select('#play-button');

        sliderSvg
            .append('svg')
            .attr('width', sliderWidth)
            .attr('height', sliderHeight)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var slider = sliderHorizontal()
            .min(1)
            .max(maxLevel)
            .step(1)
            .width(sliderWidth - 2 * sliderMargin)
            .tickValues(tickValue)
            .default(1)
            .on('onchange', val => {
                setCurrLevel(val);
            });

        var sliderRange = sliderSvg.append('g').attr('transform', `translate(${sliderMargin}, ${sliderMargin / 2})`);
        sliderRange.call(slider);

        playButton.on('click', function () {
            var button = d3.select(this);

            if (moving) {
                clearInterval(interval);
                setMoving(false);
                button.text('Play');
            } else {
                setMoving(true);
                button.text('Pause');
                interval = setInterval(function () {
                    currLevel < maxLevel ? setCurrLevel(currLevel + 1) : setCurrLevel(1);

                    slider.value(currLevel);

                    if (currLevel === maxLevel) {
                        clearInterval(interval);
                        setMoving(false);
                        playButton.text('Play');
                    }
                }, 500);
            }
        });
    }

    function drawOptimalGraph({ graphSvg, data }) {
        d3.select(graphSvg.current).selectAll('*').remove();
        // data graph 형태로 변경
        const graph = d3dag.graphStratify()(data);
        const nodeSize = 50;
        const dagDepth = data[0].level + 1;

        const layout = d3dag
            .sugiyama()
            .nodeSize([nodeSize, nodeSize])
            .gap([nodeSize / 3, nodeSize / 3]);

        const { width: dagWidth, height: dagHeight } = layout(graph);

        const scale =
            svgWidth / dagWidth < svgHeight / (dagHeight + 2 * margin.y)
                ? svgWidth / dagWidth
                : svgHeight / (dagHeight + 2 * margin.y);

        const svg = d3
            .select(graphSvg.current)
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g') // 그룹으로 묶어서
            .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 8}) scale(${scale}, ${scale})`)
            .call(
                d3.zoom().on('zoom', event => {
                    svg.attr('transform', event.transform);
                })
            )
            .append('g');

        // create links
        const links = svg
            .append('g')
            .selectAll('path')
            .data(graph.links())
            .enter()
            .append('path')
            .attr('d', d => {
                return d3.line()([
                    [d.source.x, d.source.data.level * (dagHeight / dagDepth)],
                    [d.target.x, d.target.data.level * (dagHeight / dagDepth)],
                ]);
            })
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
                    .attr('width', 50)
                    .attr('height', 50)
                    .attr('x', -nodeSize / 2)
                    .attr('y', -nodeSize / 2)
                    .attr('fill', colorMap.get(parts[1]));
            } else {
                node.append('circle')
                    .attr('r', nodeSize / 2)
                    .attr('fill', colorMap.get(nodeTypes[0]));
            }
        });

        // node type
        nodes
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('class', 'dp-node-text')
            .each(function (d) {
                const lines = mapName(d.data.id.split(' - ').pop()).split('\n');
                if (lines.length === 1) d3.select(this).text(lines[0]);
                else {
                    for (let i = 0; i < lines.length; i++) {
                        d3.select(this)
                            .append('tspan')
                            .text(lines[i])
                            .attr('x', 0)
                            .attr('dy', i ? '1.2em' : '-0.2em');
                    }
                }
            });
    }

    function drawGraph({ graphSvg, data }) {
        d3.select(graphSvg.current).selectAll('*').remove(); //clear

        // data graph 형태로 변경
        const graph = d3dag.graphStratify()(data);

        /* coumpute layout */
        const nodeSize = 50;
        const dagDepth = data[data.length - 1].level;

        const layout = d3dag
            .sugiyama()
            .nodeSize([nodeSize, nodeSize])
            .gap([nodeSize / 3, nodeSize / 3]);
        const { width: dagWidth, height: dagHeight } = layout(graph);

        const scale =
            svgWidth / dagWidth < svgHeight / (dagHeight + 2 * margin.y)
                ? svgWidth / dagWidth
                : svgHeight / (dagHeight + 2 * margin.y);

        const svg = d3
            .select(graphSvg.current)
            .append('svg')
            .attr('width', dagWidth)
            .attr('height', dagHeight)
            .append('g') // 그룹으로 묶어서
            .attr('transform', `scale(${scale}, ${scale})`)
            .call(
                d3.zoom().on('zoom', event => {
                    svg.attr('transform', event.transform);
                })
            )
            .append('g');

        // create links
        const links = svg
            .append('g')
            .selectAll('path')
            .data(graph.links())
            .enter()
            .append('path')
            .attr('d', d =>
                d3.line()([
                    [d.source.x, d.source.data.level * (dagHeight / dagDepth)],
                    [d.target.x, d.target.data.level * (dagHeight / dagDepth)],
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
                    .attr('width', 50)
                    .attr('height', 50)
                    .attr('x', -nodeSize / 2)
                    .attr('y', -nodeSize / 2)
                    .attr('fill', colorMap.get(parts[1]));
            } else {
                node.append('circle')
                    .attr('r', nodeSize / 2)
                    .attr('fill', colorMap.get(nodeTypes[0]));
            }
        });

        // node type
        nodes
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('class', 'dp-node-text')
            .each(function (d) {
                const lines = mapName(d.data.id.split(' - ').pop()).split('\n');
                if (lines.length === 1) d3.select(this).text(lines[0]);
                else {
                    for (let i = 0; i < lines.length; i++) {
                        d3.select(this)
                            .append('tspan')
                            .text(lines[i])
                            .attr('x', 0)
                            .attr('dy', i ? '1.2em' : '-0.2em');
                    }
                }
            });

        const tooltip = d3.select('body').append('div').attr('class', 'dp-tooltip').style('visibility', 'hidden');

        nodes
            .on('mouseover', function (event, d) {
                tooltip
                    .html(() => {
                        let htmlString = `${d.data.id} level: ${d.data.level}`;

                        htmlString += d.data.nodeData.startup_cost
                            ? `<br> startup_cost: ${d.data.nodeData.startup_cost}`
                            : '';
                        htmlString += d.data.nodeData.total_cost
                            ? `<br> total_cost: ${d.data.nodeData.total_cost}`
                            : '';
                        htmlString += d.data.nodeData.node ? `<br> node: ${d.data.nodeData.node}` : '';
                        htmlString += d.data.nodeData.rows ? `<br> rows: ${d.data.nodeData.rows}` : '';

                        if (d.data.nodeData.cheapest_startup_paths) {
                            htmlString += `<br> cheapest_startup_cost: ${d.data.nodeData.cheapest_startup_paths.node} ${d.data.nodeData.cheapest_startup_paths.relid}`;
                        }

                        if (d.data.nodeData.cheapest_total_paths) {
                            htmlString += `<br> cheapest_total_path: ${d.data.nodeData.cheapest_total_paths.node} ${d.data.nodeData.cheapest_total_paths.relid}`;
                        }
                        return htmlString;
                    })
                    .style('visibility', 'visible');
            })
            .on('mousemove', function (event) {
                tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
            })
            .on('mouseout', function () {
                tooltip.style('visibility', 'hidden');
            })
            .on('click', function (event, d) {
                if (
                    d.data.nodeData &&
                    d.data.nodeData.total_cost !== undefined &&
                    d.data.nodeData.total_cost !== null
                ) {
                    setTotalCost(`${d.data.nodeData.total_cost}`);
                } else if (
                    d.data.nodeData &&
                    d.data.nodeData.cheapest_total_paths &&
                    d.data.nodeData.cheapest_total_paths.total_cost !== undefined &&
                    d.data.nodeData.cheapest_total_paths.total_cost !== null
                ) {
                    setTotalCost(`${d.data.nodeData.cheapest_total_paths.total_cost}`);
                } else {
                    console.log('Total cost and cheapest total paths cost are unavailable for this node.');
                }
            });

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
                .duration(500)
                .style('opacity', 1);

            links
                .filter(function (d) {
                    return d.target.data.level === level + 1 || d.target.data.level === level;
                })
                .transition()
                .duration(500)
                .style('opacity', 1)
                .end()
                .then(() => {
                    // Second transition: Make nodes with d.data.level === level and id !== cheapestId disappear
                    nodes
                        .filter(function (d) {
                            return d.data.level === level && !cheapestId.includes(`${d.data.id.replace(/\s/g, '')}`);
                        })
                        .transition()
                        .duration(500)
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
                        .duration(500)
                        .style('opacity', 0)
                        .end()
                        .then(() => {
                            animate(level + 2);
                        });
                });
        }

        if (moving) {
            nodes.style('opacity', '0');
            links.style('opacity', '0');
            animate(0);
        }
    }

    useEffect(() => {
        const dpData = parseDp(data);
        const optimalData = parseOptimal(data);

        if (showOptimalOne) {
            setTotalCost(cheapstTotalCost);
            drawOptimalGraph({
                graphSvg: dagSvg,
                data: optimalData,
            });
        } else {
            drawGraph({
                graphSvg: dagSvg,
                data: dpData,
            });
            drawSlider({
                data: dpData,
            });
        }
    }, [data, moving, svgWidth, svgHeight, showOptimalOne]);

    return (
        <>
            <div className='flex justify-center items-center gap-6 pb-4'>
                <div className='stats shadow'>
                    <div className='flex m-2 gap-2'>
                        <div className='dp-total-cost'>Total Cost</div>
                        <div className='dp-cost-value'>{totalCost}</div>
                    </div>
                </div>
                <div className='flex justify-center items-center gap-2'>
                    {showOptimalOne ? null : (
                        <button className='dp-play-text' id='play-button'>
                            Play
                        </button>
                    )}
                    {showOptimalOne ? null : (
                        <svg
                            className='slider'
                            ref={sliderRef}
                            width={sliderWidth + sliderMargin * 2}
                            height={sliderHeight}
                        />
                    )}
                </div>
            </div>
            <div>
                <svg ref={dagSvg} width={svgWidth} height={svgHeight + 4 * margin.y} />
                <div className='checkbox-container'>
                    <Checkbox
                        color='blue'
                        className='h-4 w-4 rounded-full border-gray-900/20 bg-gray-900/10 transition-all hover:scale-105 hover:before:opacity-0'
                        checked={showOptimalOne}
                        label={<p className='text'>Show Optimized One</p>}
                        onChange={handleCheckboxChange}
                    />
                </div>
            </div>
        </>
    );
};

export default GraphView;
