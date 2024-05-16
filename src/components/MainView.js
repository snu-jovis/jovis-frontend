import { useRef, useContext, useEffect, useState } from "react";

import Editor from "@monaco-editor/react";
import { Button, Select, Option, Spinner } from "@material-tailwind/react";

import GeqoMain from "./geqo/GeqoMain";
import DpMain from "./dp/DpMain";

import { HistoryContext } from "./providers/HistoryProvider";
import { SqlToEditorContext } from "./providers/SqlToEditorProvider";
import axios from "axios";

export default function MainView() {
  const editorRef = useRef(null);
  const { addHistory } = useContext(HistoryContext);
  const { setCallback } = useContext(SqlToEditorContext);

  const [database, setDatabase] = useState("postgres"); // candidates: postgres, tpch1gb, and tpcds1gb
  const [queryRes, setQueryRes] = useState({});

  const [isLoading, setLoading] = useState(false);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const submitQuery = (db, sql) => {
    setLoading(true);
    axios
      .post("http://147.46.125.229:8000/query/", {
        query: sql,
        db: db,
      })
      .then((response) => {
        setQueryRes(response.data);
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
    // the exact database name (e..g, tpch1gb and tpcds1gb) should be known by only the main view
    // another component only knows the database type (e.g., tpch and tpcds)
    if (database === "tpch1gb") {
      addHistory("tpch", sql);
    } else if (database === "tpcds1gb") {
      addHistory("tpcds", sql);
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
    } else {
      setDatabase("postgres");
    }
  };

  useEffect(() => {
    setCallback(onSidebarSignal);
  }, []);

  return (
    <div className="view-container grow">
      <div className="border-2 border-solid flex flex-col mb-2">
        <Editor
          height="20vh"
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
            </Select>
          </div>
          {isLoading && (
            <div className="flex items-center">
              <Spinner className="w-8 h-8" />
            </div>
          )}
        </div>
      </div>
      {queryRes.optimizer ? (
        <div>
          {queryRes.optimizer
            .filter((opt) => opt.type === "dp")
            .map((opt, index) => (
              <DpMain
                key={index}
                data={opt}
                plan={queryRes.result[0][0][0].Plan}
              />
            ))}
          {queryRes.optimizer
            .filter((opt) => opt.type === "geqo")
            .map((opt, index) => (
              <GeqoMain
                key={index}
                data={opt}
                plan={queryRes.result[0][0][0].Plan}
              />
            ))}
        </div>
      ) : null}
    </div>
  );
}
