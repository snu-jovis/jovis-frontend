import { useState } from "react";
import { Button } from "@material-tailwind/react";

const Rerun = ({ query, database, data, submitQuery, addHistory }) => {
  const [topN, setTopN] = useState(5);
  const [specifiedJoinOrder, setSpecifiedJoinOrder] = useState("");
  const [newSeed, setNewSeed] = useState(data.geqo_seed);
  const [newBias, setNewBias] = useState(data.selection_bias);

  const updateJoinOrder = (N) => {
    return data.gen[data.pool_size].pool
      .slice(0, N)
      .map((gene) => gene.gene)
      .join(",");
  };

  const addConfToSQL = (sql, order) => `
    set local geqo_adaptive_pool to on;
    set local geqo_init_pool to '${order}';
    set local geqo_seed to ${newSeed};
    set local geqo_selection_bias to ${newBias};
    ${sql}
  `;

  const handleRerun = () => {
    let joinOrder = updateJoinOrder(topN);
    joinOrder = joinOrder
      ? joinOrder + "," + specifiedJoinOrder
      : specifiedJoinOrder;

    const modifiedSQL = addConfToSQL(query, joinOrder);
    submitQuery(database, modifiedSQL);
    if (database === "tpch1gb") {
      addHistory("tpch", modifiedSQL);
    } else if (database === "tpcds1gb") {
      addHistory("tpcds", modifiedSQL);
    } else {
      addHistory(database, modifiedSQL);
    }
  };

  return (
    <div className="px-4 pt-2">
      <p className="text-ebsm">Rerun with Custom Configuration</p>

      <div className="flex items-center mt-2 gap-2">
        <label className="text-rsm">Reuse Top</label>
        <input
          type="number"
          className="text-rsm w-20 border p-1 rounded"
          value={topN}
          onChange={(e) => setTopN(Number(e.target.value))}
          min={0}
          max={data.pool_size}
        />
        <p className="text-rsm">Genes out of {data.pool_size}</p>
      </div>

      <div className="flex flex-col mt-1">
        <label className="text-rsm">Specify Join Order for Initial Pool</label>
        <p className="text-lxsm my-1">
          {Object.entries(data.map)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")}
        </p>
        <textarea
          className="text-rsm w-full border p-2 rounded h-10"
          placeholder="Enter join order..."
          value={specifiedJoinOrder}
          onChange={(e) => setSpecifiedJoinOrder(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between mt-1">
        <label className="text-rsm">Set GEQO Seed (0.0 - 1.0)</label>
        <input
          type="number"
          step="0.1"
          className="text-rsm w-20 border p-1 rounded"
          value={newSeed}
          onChange={(e) => setNewSeed(Number(e.target.value))}
          min={0.0}
          max={1.0}
        />
      </div>

      <div className="flex items-center justify-between mt-1">
        <label className="text-rsm">Set Selection Bias (1.5 - 2.0)</label>
        <input
          type="number"
          step="0.1"
          className="text-rsm w-20 border p-1 rounded"
          value={newBias}
          onChange={(e) => setNewBias(Number(e.target.value))}
          min={1.5}
          max={2.0}
        />
      </div>

      <div className="flex justify-center my-2">
        <Button className="py-2" ripple={false} onClick={handleRerun}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Rerun;
