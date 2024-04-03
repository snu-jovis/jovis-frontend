import "./App.css";
import Layout from "./components/Layout";
import React from "react";

import { HistoryProvider } from "./components/providers/HistoryProvider";
import { SqlToEditorProvider } from "./components/providers/SqlToEditorProvider";
import { GeqoProvider } from "./components/providers/GeqoProvider";
import { DpProvider } from "./components/providers/DpProvider";

function App() {
  return (
    <div className="App">
      <SqlToEditorProvider>
        <HistoryProvider>
          <DpProvider>
            <GeqoProvider>
              <Layout />
            </GeqoProvider>
          </DpProvider>
        </HistoryProvider>
      </SqlToEditorProvider>
    </div>
  );
}

export default App;
