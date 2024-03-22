import React, { useState } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";

const SQLEditor = (props = {}) => {
  const [lineData, setLineData] = useState([
    <TerminalOutput>You can use pg_plan_hint directly here!</TerminalOutput>,
  ]);

  return (
    <div className="container">
      <Terminal
        colorMode={ColorMode.Light}
        onInput={(terminalInput) =>
          console.log(`New terminal input received: '${terminalInput}'`)
        }
      >
        {lineData}
      </Terminal>
    </div>
  );
};

export default SQLEditor;
