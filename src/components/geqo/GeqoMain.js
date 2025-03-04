import { useContext } from "react";
import { QueriesContext } from "../providers/QueriesProvider";

import GeqoOpt from "./GeqoOpt";
import Explain from "../explain/Explain";

const GeqoMain = ({ tab }) => {
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
                <GeqoOpt
                  key={`geqo-opt-${id}`}
                  title={query.title}
                  // TODO: can GEQO have multiple optimization results?
                  data={query.opt[0]}
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
                key={`geqo-explain-${id}`}
                title={query.title}
                data={query.plan}
              />
            );
          })}
      </div>
    </>
  );
};

export default GeqoMain;
