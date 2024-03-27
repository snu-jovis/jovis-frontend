import { useEffect, useRef, useContext } from "react";
import * as d3 from "d3";
import { GeqoContext } from "../providers/GeqoProvider";

const JoinOrderTree = () => {
  const { relMap, chosen } = useContext(GeqoContext);

  // Convert the string of integers into an array of integers
  const chosenArray = chosen.split(" ").map(Number);

  let joinId = chosenArray.length + 1;

  // root node
  const rootNode = {
    id: joinId,
    parent: null,
    name: "Join",
  };

  // rest of the tree
  let currentNode = rootNode;
  for (let i = chosenArray.length - 1; i > 0; i--) {
    if (i === 1) {
      const leftNode = {
        id: chosenArray[i],
        parent: currentNode,
        name: relMap[chosenArray[i]],
      };
      const rightNode = {
        id: chosenArray[i - 1],
        parent: currentNode,
        name: relMap[chosenArray[i - 1]],
      };

      currentNode.children = [leftNode, rightNode];
      break;
    }

    joinId += 1;
    const leftNode = { id: joinId, parent: currentNode, name: "Join" };
    const rightNode = {
      id: chosenArray[i],
      parent: currentNode,
      name: relMap[chosenArray[i]],
    };

    currentNode.children = [leftNode, rightNode];
    currentNode = leftNode;
  }

  const treeSvg = useRef(null);

  const width = 400;
  const height = 400;
  const marginY = 0;
  const defaultRadius = 8;

  // data를 d3의 계층 구조로 바꾸어주기
  const root = d3.hierarchy(rootNode);
  console.log(root);

  const dx = width / 5;
  const dy = 30;

  const treeLayout = d3.tree().nodeSize([dx, dy]);
  const treeData = treeLayout(root);
  const diagonal = d3
    .linkVertical()
    .x((d) => d.x)
    .y((d) => d.y);

  useEffect(() => {
    d3.select(treeSvg.current).selectAll("*").remove(); // clear

    // create tree
    const svg = d3
      .select(treeSvg.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height + 2 * marginY)
      .append("g") // 그룹으로 묶어서
      .attr("transform", `translate(${width / 2}, ${marginY})`) // margin 적용
      .call(
        d3.zoom().on("zoom", (event) => {
          svg.attr("transform", event.transform);
        })
      )
      .append("g");

    // create links
    const gLink = svg
      .append("g")
      .attr("id", "g-link")
      .attr("fill", "none")
      .attr("stroke", "lightgrey");

    // create nodes
    const gNode = svg.append("g").attr("id", "g-node");

    function update(event, source) {
      const nodes = root.descendants().reverse();
      const links = root.links();
      const transition = svg.transition().duration(500);

      // update nodes
      const node = gNode.selectAll("g").data(nodes, (d) => d.id);

      // enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${source.x0},${source.y0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });

      // append circles
      nodeEnter
        .append("circle")
        .attr("id", "node-circle")
        // .attr("fill", (d) => nodeColor(d.data["Node Type"]))
        .attr("fill", "lightgrey")
        .attr("r", defaultRadius);

      // append node type
      nodeEnter
        .append("text")
        .attr("id", "node-type")
        .attr("class", "node-type")
        .attr("text-anchor", "start")
        .text((d) => d.data.name);

      // append relation name
      nodeEnter
        .append("text")
        .attr("id", "relation-name")
        .attr("class", "relation-name")
        .attr("dy", 12)
        .attr("text-anchor", "start")
        .text((d) =>
          d.data["Relation Name"]
            ? d.data["Relation Name"].toUpperCase()
            : d.data.table_name
            ? d.data.table_name.toUpperCase()
            : null
        );

      node
        .merge(nodeEnter)
        .transition(transition)
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      node
        .exit()
        .transition(transition)
        .remove()
        .attr("transform", (d) => `translate(${source.x},${source.y})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // update links
      const link = gLink.selectAll("path").data(links, (d) => d.target.id);

      // enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .append("path")
        .attr("id", "link-path")
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      link.merge(linkEnter).transition(transition).attr("d", diagonal);

      link
        .exit()
        .transition(transition)
        .remove()
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      root.eachBefore((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    root.x0 = 0;
    root.y0 = dy / 2;

    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
    });

    update(null, root);
  }, [chosen]);

  return (
    <div>
      <svg ref={treeSvg} width={width} height={height + 2 * marginY}></svg>
    </div>
  );
};

export default JoinOrderTree;
