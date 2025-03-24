import { useState } from "react";
import GraphView from "./GraphView";
import CostCard from "./CostCard";

const DpOpt = ({ title, data }) => {
  const [nodes, setNodes] = useState([]);
  const addNode = (index, id, detail) => {
    setNodes((prev) => {
      const isExist = prev.find(
        (node) => node.index === index && node.id === id
      );
      if (isExist) return prev;

      return [...prev, { index, id, detail }];
    });
  };

  const removeNode = (index, id) => {
    setNodes((prev) =>
      prev.filter((node) => node.index !== index || node.id !== id)
    );
  };

  return (
    <div className="my-2">
      <p className="text-bm">{title}</p>
      <hr className="my-1 border-2" />
      <div>
        {(() => {
          const rows = [];
          let currentRow = [];

          data.forEach((item, index) => {
            currentRow.push(
              <div key={index}>
                <GraphView
                  index={index}
                  base={item.base}
                  dp={item.dp}
                  selectedNodes={nodes}
                  addNode={addNode}
                  removeNode={removeNode}
                />
              </div>
            );

            if (currentRow.length === 3 || index === data.length - 1) {
              rows.push(
                <div key={`row-${rows.length}`} className="flex gap-4 mb-2">
                  {currentRow}
                </div>
              );
              currentRow = [];
            }
          });

          return rows;
        })()}
      </div>
      <CostCard nodes={nodes} />
    </div>
  );
};

export default DpOpt;
