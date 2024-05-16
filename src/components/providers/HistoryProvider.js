import { createContext, useEffect, useState } from "react";

const TITLE_SUBSTRING_LENGTH = 24;
const HISTORY_LENGTH = 8;

export const HistoryContext = createContext({
  history: [],
  addHistory: () => {},
});

export function HistoryProvider({ children }) {
  /* LocalStorage Data Format
        history = {
            "history": [
                {"title: "SELECT * FROM Reserves", "query": "SELECT * FROM Reserves", "db": "postgres"},
                {"title: "SELECT * FROM Sailors ...", "query": "SELECT * FROM Sailors ORDER BY sid DESC LIMIT 10", "db": "tpch"},
                {"title: "SELECT * FROM Sailors ...", "query": "SELECT * FROM Sailors ORDER BY sid DESC LIMIT 1"},
            ]
        }
    */

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storage = localStorage.getItem("history");
    if (storage) {
      const parsed = JSON.parse(storage);
      if (parsed.data) {
        setHistory(parsed.data);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify({ data: history }));
  }, [history]);

  const onAddHistory = (db, sql) => {
    const newData = {
      title: sql.substring(0, Math.min(sql.length, TITLE_SUBSTRING_LENGTH)),
      query: sql,
      db: db,
    };
    let newHistory = [newData, ...history];

    // only last five queries
    if (newHistory.length > HISTORY_LENGTH) {
      newHistory.pop();
    }
    setHistory(newHistory);
  };

  return (
    <HistoryContext.Provider
      value={{
        history: history,
        addHistory: onAddHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}
