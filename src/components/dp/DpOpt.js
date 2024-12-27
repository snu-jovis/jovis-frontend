import { useState, useRef } from "react";
import GraphView from "./GraphView";
import CostCard from "./CostCard";

import "../../assets/stylesheets/Dp.css";

const DpOpt = ({ title, data }) => {
  const viewRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const addNode = (id, detail) => {
    setNodes((prev) => {
      const isExist = prev.find((node) => node.id === id);
      if (isExist) return prev;

      return [...prev, { id, detail }];
    });
  };

  const removeNode = (id) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
  };

  return (
    <div ref={viewRef}>
      <p className="text-bm">{title}</p>
      <hr className="my-1 border-2" />
      <div className="flex gap-4">
        {data.map((item, index) => (
          <div key={index}>
            <GraphView
              base={item.base}
              dp={item.dp}
              selectedNodes={nodes}
              addNode={addNode}
              removeNode={removeNode}
            />
          </div>
        ))}
      </div>
      <CostCard nodes={nodes} />
    </div>
  );
};

export default DpOpt;
