import { useRef, useContext } from 'react';

import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { Button } from "@material-tailwind/react";

import Dp from "./dp/Dp";
import Geqo from "./geqo/Geqo";

import { HistoryContext } from "./providers/HistoryProvider";
import axios from 'axios';


export default function MainView() {

    const editorRef = useRef(null);
    const { addHistory } = useContext(HistoryContext);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    }

    const onClickSubmit = () => {
        const sql = editorRef.current.getValue();
        addHistory(sql);

        axios.post("http://localhost:8000/query/", {
            query: sql
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    const onClickClear = () => {
        editorRef.current.setValue("");
    }

    return (
        <div className="view-container grow">
            <div className="border-2 border-solid flex flex-col">
                <Editor height="20vh" 
                    defaultLanguage="sql" 
                    defaultValue="/* Type your query here */" 
                    // theme="vs-dark" 
                    onMount={handleEditorDidMount}
                    options={{
                        minimap: { enabled: false },
                    }}/>
                <div className="flex flex-row-reverse gap-2 m-4">
                    <Button variant="outlined" ripple={false} onClick={onClickClear}>Clear</Button>
                    <Button ripple={false} onClick={onClickSubmit}>Submit</Button>
                </div>
            </div>
            <div className="flex justify-center items-center h-60">
                {/* DP or GEQO here */}
                <h1>DP or GEQO here!</h1>
                <Dp />
                <Geqo />
            </div>
        </div>
    )
}