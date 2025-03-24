import React from "react";
import "./App.css";
import Layout from "./components/Layout";

import { QueriesProvider } from "./components/providers/QueriesProvider";
import { HistoryProvider } from "./components/providers/HistoryProvider";
import { SqlToEditorProvider } from "./components/providers/SqlToEditorProvider";

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
        <QueriesProvider>{children}</QueriesProvider>
      </HistoryProvider>
    </SqlToEditorProvider>
  );
}

export default App;
