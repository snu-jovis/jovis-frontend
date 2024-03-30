import { useRef, useContext, useEffect, useState } from 'react';

import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { Button } from "@material-tailwind/react";

import Dp from "./dp/Dp";
import GeqoMain from "./geqo/GeqoMain";

import { HistoryContext } from "./providers/HistoryProvider";
import { SqlToEditorContext } from "./providers/SqlToEditorProvider";
import axios from 'axios';


export default function MainView() {

  const editorRef = useRef(null);
  const { addHistory } = useContext(HistoryContext);
  const { setCallback } = useContext(SqlToEditorContext);

  const [ queryRes, setQueryRes ] = useState({});

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const submitQuery = (sql) => {
    axios
      .post("http://147.46.125.229:8000/query/", {
        query: sql,
      })
      .then((response) =>{
        console.log(response);
        setQueryRes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const onClickSubmit = () => {
    const sql = editorRef.current.getValue();
    addHistory(sql);
    submitQuery(sql);
  };

  const onClickClear = () => {
    editorRef.current.setValue("");
  };

  const onSidebarSignal = (sql) => {
    editorRef.current.setValue(sql);
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
          // theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
          }}
        />
        <div className="flex flex-row-reverse gap-2 mx-4 my-2">
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
        </div>
      </div>
      <div>
        {/* DP or GEQO here */}
        <GeqoMain data={queryRes}/>
      </div>
    </div>
  );
}
