import React from "react";
import "./App.css";
import Layout from "./components/Layout";

import { QueriesProvider } from "./components/providers/QueriesProvider";
import { HistoryProvider } from "./components/providers/HistoryProvider";
import { SqlToEditorProvider } from "./components/providers/SqlToEditorProvider";
import { GeqoProvider } from "./components/providers/GeqoProvider";

function App() {
  return (
    <div className="App">
      <AppProviders>
        <Layout />
      </AppProviders>
    </div>
  );
}

function AppProviders({ children }) {
  return (
    <SqlToEditorProvider>
      <HistoryProvider>
        <QueriesProvider>
          <GeqoProvider>{children}</GeqoProvider>
        </QueriesProvider>
      </HistoryProvider>
    </SqlToEditorProvider>
  );
}

export default App;
