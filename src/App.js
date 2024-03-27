import "./App.css";
import Layout from "./components/Layout";
import React from "react";

import { HistoryProvider } from "./components/providers/HistoryProvider";
import { GeqoProvider } from "./components/providers/GeqoProvider";

function App() {
  return (
    <div className="App">
      <HistoryProvider>
        <GeqoProvider>
          <Layout />
        </GeqoProvider>
      </HistoryProvider>
    </div>
  );
}

export default App;
