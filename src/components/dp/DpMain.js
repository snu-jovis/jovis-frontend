import { useContext } from "react";
import { QueriesContext } from "../providers/QueriesProvider";

import DpOpt from "./DpOpt";
import Explain from "../explain/Explain";

const DpMain = ({ tab }) => {
  const { queries, selectedQueries } = useContext(QueriesContext);

  return (
    <>
      <div>
        {tab === "planning" &&
          (() => {
            const rows = [];
            let currentRow = [];

            selectedQueries.forEach((id, i) => {
              const query = queries.find((q) => q.id === id); // find query by id
              if (!query) return;

              const optLength = query.opt?.length || 0;

              currentRow.push(
                <DpOpt
                  key={`dp-opt-${id}`}
                  title={query.title}
                  data={query.opt}
                />
              );
              if (
                optLength >= 2 ||
                currentRow.length === 2 ||
                i === selectedQueries.length - 1
              ) {
                rows.push(
                  <div key={`row-${rows.length}`} className="flex gap-6 mb-4">
                    {currentRow}
                  </div>
                );
                currentRow = [];
              }
            });
            return rows;
          })()}
      </div>
      <div>
        {tab === "explain" &&
          selectedQueries.map((id) => {
            const query = queries.find((q) => q.id === id);
            if (!query) return null;
            return (
              <Explain
                key={`dp-explain-${id}`}
                title={query.title}
                data={query.plan}
              />
            );
          })}
      </div>
    </>
  );
};

export default DpMain;
