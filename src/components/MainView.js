import { useRef, useContext, useEffect, useState } from "react";
import axios from "axios";

import Editor from "@monaco-editor/react";
import { Button, Select, Option, Spinner } from "@material-tailwind/react";

import { QueriesContext } from "./providers/QueriesProvider";
import { HistoryContext } from "./providers/HistoryProvider";
import { SqlToEditorContext } from "./providers/SqlToEditorProvider";
import { GeqoProvider } from "./providers/GeqoProvider";

import DpOpt from "./dp/DpOpt";
import GeqoOpt from "./geqo/GeqoOpt";
import Explain from "./explain/Explain";

export default function MainView() {
  const editorRef = useRef(null);

  const { queries, addQueries, selectedQueries } = useContext(QueriesContext);
  const { addHistory } = useContext(HistoryContext);
  const { setCallback } = useContext(SqlToEditorContext);

  // candidates: postgres, tpch1gb, tpcds1gb, and imdbload
  const [database, setDatabase] = useState("postgres");
  const [queryRes, setQueryRes] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("planning");

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const submitQuery = (db, sql) => {
    setLoading(true);
    axios
      .post("http://localhost:8000/query/", {
        query: sql,
        db: db,
      })
      .then((response) => {
        setQueryRes(response.data);
        addQueries(
          sql,
          db,
          response.data.optimizer,
          response.data.result[0][0][0].Plan
        );
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const onClickSubmit = () => {
    const sql = editorRef.current.getValue();
    submitQuery(database, sql);

    // history
    // the exact database name (e.g., tpch1gb, tpcds1gb, and imdbload) should be known by only the main view
    // another component only knows the database type (e.g., tpch, tpcds and imdb)
    if (database === "tpch1gb") {
      addHistory("tpch", sql);
    } else if (database === "tpcds1gb") {
      addHistory("tpcds", sql);
    } else if (database === "imdbload") {
      addHistory("imdb", sql);
    } else {
      addHistory(database, sql);
    }
  };

  const onClickClear = () => {
    editorRef.current.setValue("");
    setDatabase("postgres");
  };

  const onSidebarSignal = (type, sql) => {
    editorRef.current.setValue(sql);
    if (type === "tpch") {
      setDatabase("tpch1gb");
    } else if (type === "tpcds") {
      setDatabase("tpcds1gb");
    } else if (type === "job") {
      setDatabase("imdbload");
    } else {
      setDatabase("postgres");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getTabClass = (tab) =>
    `inline-block p-2 rounded-t-lg ${
      activeTab === tab
        ? "text-ebsm text-blue-600 bg-white"
        : "text-bsm text-gray-400"
    }`;

  useEffect(() => {
    setCallback(onSidebarSignal);
  }, []);

  return (
    <div className="view-container">
      <div className="border-2 border-solid flex flex-col m-4">
        <Editor
          height="180px"
          defaultLanguage="sql"
          defaultValue="/* Type your query here */"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
          }}
        />
        <div className="flex flex-row-reverse items-strech gap-2 mx-4 my-2">
          <Button
            className="px-2 py-2"
            variant="outlined"
            ripple={false}
            onClick={onClickClear}
          >
            Clear
          </Button>
          <Button className="px-2 py-2" ripple={false} onClick={onClickSubmit}>
            Submit
          </Button>
          <div className="w-52">
            <Select
              label="Select Database"
              value={database}
              onChange={setDatabase}
            >
              <Option value="postgres">Default Database</Option>
              <Option value="tpch1gb">TPC-H</Option>
              <Option value="tpcds1gb">TPC-DS</Option>
              <Option value="imdbload">IMDB</Option>
            </Select>
          </div>
          {isLoading && (
            <div className="flex items-center">
              <Spinner className="w-8 h-8" />
            </div>
          )}
        </div>
      </div>
      <div className="m-4">
        <div>
          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
            <li className="me-2">
              <button
                onClick={() => handleTabChange("planning")}
                className={getTabClass("planning")}
              >
                Query Planning
              </button>
            </li>
            <li className="me-2">
              <button
                onClick={() => handleTabChange("explain")}
                className={getTabClass("explain")}
              >
                EXPLAIN
              </button>
            </li>
          </ul>
        </div>
        <div>
          {activeTab === "planning" &&
            (() => {
              const rows = [];
              let currentRow = [];
              let i = 0;

              selectedQueries.forEach((id) => {
                const query = queries.find((q) => q.id === id); // find query by id
                if (!query) return;

                const optLength = query.opt?.length || 0;
                const optType = query.opt?.[0]?.type;

                if (optType === "dp") i += optLength;
                else if (optType === "geqo") i = 4;

                if (i > 3) {
                  rows.push(
                    <div key={`row-${rows.length}`} className="flex gap-6">
                      {currentRow}
                    </div>
                  );
                  currentRow = [];
                  i = optLength;
                }

                if (optType === "dp") {
                  currentRow.push(
                    <DpOpt
                      key={`dp-opt-${id}`}
                      title={query.title}
                      data={query.opt}
                    />
                  );
                  if (i > 3) {
                    rows.push(
                      <div key={`row-${rows.length}`} className="flex gap-6">
                        {currentRow}
                      </div>
                    );
                    currentRow = [];
                    i = 0;
                  }
                } else if (optType === "geqo") {
                  rows.push(
                    <div key={`row-${rows.length}`} className="flex gap-6">
                      <GeqoProvider>
                        <GeqoOpt
                          key={`geqo-opt-${id}`}
                          title={query.title}
                          data={query}
                          submitQuery={submitQuery}
                          addHistory={addHistory}
                        />
                      </GeqoProvider>
                    </div>
                  );
                  i = 0;
                }
              });
              rows.push(
                <div key={`row-${rows.length}`} className="flex gap-6">
                  {currentRow}
                </div>
              );

              return rows;
            })()}
        </div>
        <div className="mt-4">
          {activeTab === "explain" &&
            selectedQueries.map((id) => {
              const query = queries.find((q) => q.id === id);
              if (!query) return null;
              return (
                <Explain
                  key={`explain-${id}`}
                  title={query.title}
                  data={query.plan}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
