import "./App.css";
import Layout from "./components/Layout";
import React from "react";

import { HistoryProvider } from "./components/providers/HistoryProvider";
import { GeqoProvider } from "./components/providers/GeqoProvider";
import { SqlToEditorProvider } from "./components/providers/SqlToEditorProvider";

function App() {
  return (
    <div className="App">
      <SqlToEditorProvider>
        <HistoryProvider>
          <GeqoProvider>
            <Layout />
          </GeqoProvider>
        </HistoryProvider>
      </SqlToEditorProvider>
    </div>
  );
}

export default App;
