import Dp from "./dp/Dp";
import Geqo from "./geqo/Geqo";
import SQLEditor from "./SQLEditor";
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { Button } from "@material-tailwind/react";


export default function MainView() {
    return (
        <div className="view-container grow">
            <div className="border-2 border-solid flex flex-col">
                <Editor height="20vh" 
                    defaultLanguage="sql" 
                    defaultValue="SELECT 'Hello World'" 
                    // theme="vs-dark" 
                    options={{
                    minimap: { enabled: false },
                    }}/>
                <div className="flex flex-row-reverse gap-2 m-4">
                    <Button variant="outlined" ripple={false}>Clear</Button>
                    <Button ripple={false}>Submit</Button>
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