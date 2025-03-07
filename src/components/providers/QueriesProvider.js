import { createContext, useState } from "react";

const TITLE_SUBSTRING_LENGTH = 24;

export const QueriesContext = createContext({
  queries: [],
  selectedQueries: [],
  addQueries: () => {},
  addSelectedQueries: () => {},
  delQueries: () => {},
});

export function QueriesProvider({ children }) {
  const [queries, setQueries] = useState([]);
  const [selectedQueries, setSelectedQueries] = useState([]);

  const onAddQueries = (sql, db, opt, plan) => {
    const newData = {
      id: Date.now(),
      title: sql.substring(0, Math.min(sql.length, TITLE_SUBSTRING_LENGTH)),
      query: sql,
      database: db,
      opt,
      plan,
    };

    setQueries((prevQueries) => {
      const updatedQueries = [...prevQueries, newData];
      setSelectedQueries((prevSelected) =>
        [...prevSelected, newData.id].sort((a, b) => a - b)
      );

      return updatedQueries;
    });
  };

  const onAddSelectedQueries = (id) => {
    setSelectedQueries((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id].sort((a, b) => a - b)
    );
  };

  const onDelQueries = (id) => {
    setSelectedQueries((prevSelected) =>
      prevSelected.filter((itemId) => itemId !== id)
    );
    setQueries((prevQueries) => prevQueries.filter((query) => query.id !== id));
  };

  return (
    <QueriesContext.Provider
      value={{
        queries,
        selectedQueries,
        addQueries: onAddQueries,
        addSelectedQueries: onAddSelectedQueries,
        delQueries: onDelQueries,
      }}
    >
      {children}
    </QueriesContext.Provider>
  );
}
