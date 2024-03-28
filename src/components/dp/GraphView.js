import React, { useEffect, useState, useRef } from 'react';
import { parseDp } from './parseDp';
import dp from '../../data/dp/dp.json';
import * as d3 from 'd3';
import * as d3dag from 'https://cdn.skypack.dev/d3-dag@1.0.0-1';

import '../../assets/stylesheets/Dp.css';

const GraphView = props => {
    const dagSvg = useRef(null);

    const marginY = 35;
    const svgHeight = 500;
    const svgWidth = 2048;

    const query = dp.query;
    const queryResult = dp.result;

    const targetEntry = dp.optimizer.dp[dp.optimizer.dp.length - 1];
    const totalCost = targetEntry ? targetEntry.cheapest_total_paths.total_cost : 'N/A';

    const [results, setResults] = useState([]);

    /* process data */
    useEffect(() => {
        const dpData = parseDp(dp);
        setResults(dpData);
    }, []);

    /* draw a graph */
    useEffect(() => {
        drawGraph({
            graphSvg: dagSvg,
            data: results,
        });
    });

    function drawGraph(props) {
        const { graphSvg, data } = props;
        d3.select(graphSvg.current).selectAll('*').remove(); //clear

        try {
            // data graph 형태로 변경
            const graph = d3dag.graphStratify()(data);

            /* coumput layout */
            const nodeRadius = 25;
            const nodeSize = [nodeRadius * 2, nodeRadius * 2];
            const shape = d3dag.tweakShape(nodeSize, d3dag.shapeEllipse);

            const line = d3.line().curve(d3.curveMonotoneY);
            const layout = d3dag
                .sugiyama()
                .nodeSize(node => {
                    if (node.data.id.includes(' - ')) {
                        const textLength = node.data.id.length * 6;
                        return [textLength + 20, 30];
                    } else {
                        return [50, 50]; // Size for circles
                    }
                })
                .gap([20, 20])
                .tweaks([shape]);

            const { width, height } = layout(graph);

            /* color */
            const colorMap = new Map();
            const nodesArray = Array.from(graph.nodes());
            const linksArray = Array.from(graph.links());

            const nodeTypes = [
                ...new Set(
                    nodesArray.map(node => {
                        const parts = node.data.id.split(' - ');
                        if (parts.length > 1) {
                            const subParts = parts[1].split(' ');
                            return subParts.slice(0, subParts.length - 1).join(' ');
                        }
                        return parts[1];
                    })
                ),
            ];

            nodeTypes.forEach((type, i) => {
                colorMap.set(type, d3.interpolateRainbow(i / nodeTypes.length));
            });

            /* draw a graph */
            // create graph
            const svg = d3.select(graphSvg.current);

            svg.append('svg')
                .attr('width', svgWidth)
                .attr('height', svgHeight)
                .style('fill', '#F5F5F2')
                .append('g') // 그룹으로 묶어서
                .attr('transform', `scale(1, -1) translate(0, -${height})`, { marginY })
                .call(
                    d3.zoom().on('zoom', event => {
                        svg.attr('transform', event.transform);
                    })
                )
                .append('g');

            // create links
            svg.append('g')
                .selectAll('path')
                .data(graph.links())
                .enter()
                .append('path')
                .attr('d', ({ points }) => line(points))
                .attr('fill', 'none')
                .attr('stroke-width', 3)
                .attr('stroke', 'lightgrey');

            linksArray.forEach(d => {
                svg.append('text')
                    .text(() => {
                        if (d.source.data.labels) {
                            return d.source.data.labels[0];
                        }
                        return '';
                    })
                    .attr('fill', 'red')
                    .attr('font-size', '16')
                    .attr('text-anchor', 'middle')
                    .attr('x', () => {
                        // return d.points[0][0];
                        return d.points[0][0] + (d.points[d.points.length - 1][0] - d.points[0][0]) / 2;
                    })
                    .attr('y', () => {
                        // return d.points[0][1]
                        return d.points[0][1] + (d.points[d.points.length - 1][1] - d.points[0][1]) / 2;
                    });
            });

            // create nodes
            const nodes = svg
                .append('g')
                .selectAll('g')
                .data(graph.nodes())
                .enter()
                .append('g')
                .attr('transform', ({ x, y }) => `translate(${x}, ${y})`);

            // apply colors to nodes
            nodes.each(function (d) {
                const node = d3.select(this);
                const parts = d.data.id.split(' - ');

                let nodeType;
                if (parts.length > 1) {
                    const subParts = parts[1].split(' ');
                    if (!isNaN(subParts[subParts.length - 1])) {
                        nodeType = subParts.slice(0, -1).join(' ');
                    } else {
                        nodeType = parts[1];
                    }
                } else {
                    nodeType = parts[0];
                }

                if (d.data.id.includes(' - ')) {
                    node.append('rect')
                        .attr('width', d.data.id.length * 6 + 20)
                        .attr('height', 30)
                        .attr('x', -d.data.id.length * 3 - 10)
                        .attr('y', -15)
                        .attr('fill', colorMap.get(nodeType))
                        .attr('stroke', 'black');
                } else {
                    node.append('circle').attr('r', nodeRadius).attr('fill', colorMap.get(nodeType));
                }
            });

            // text
            nodes
                .append('text')
                .text(d => d.data.id.split(' - ').pop())
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('fill', 'white');

            // create arrows
            const arrowSize = (nodeRadius * nodeRadius) / 20.0;
            const arrowLen = Math.sqrt((4 * arrowSize) / Math.sqrt(3));
            const arrow = d3.symbol().type(d3.symbolTriangle).size(arrowSize);

            svg.append('g')
                .selectAll('path')
                .data(graph.links())
                .enter()
                .append('path')
                .attr('d', arrow)
                .attr('transform', ({ points }) => {
                    const [[sx, sy], [ex, ey]] = points.slice(-2);
                    const dx = sx - ex;
                    const dy = sy - ey;
                    // This is the angle of the last line segment
                    const angle = (Math.atan2(-dy, -dx) * 180) / Math.PI + 90;
                    return `translate(${ex}, ${ey}) rotate(${angle})`;
                })
                .attr('fill', ({ target }) => colorMap[target.data.id])
                .attr('stroke', 'white')
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', `${arrowLen},${arrowLen}`);
        } catch (error) {
            console.error('Error building graph:', error);
        }
    }

    return (
        <div>
            <h2>Query</h2>
            <p>{query}</p>
            <h2>Result</h2>
            <p>{queryResult}</p>
            <h2>Total Cost</h2>
            <p>{totalCost}</p>
            <svg ref={dagSvg} width={svgWidth} height={svgHeight}></svg>
        </div>
    );
};

export default GraphView;
