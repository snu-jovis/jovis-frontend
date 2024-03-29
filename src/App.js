import './App.css';
import Layout from './components/Layout';
import React from 'react';

import { HistoryProvider } from './components/providers/HistoryProvider';
import { SqlToEditorProvider } from './components/providers/SqlToEditorProvider';

function App() {
  return (
    <div className="App">
      <SqlToEditorProvider>
        <HistoryProvider>
          <Layout/>
        </HistoryProvider>
      </SqlToEditorProvider>
    </div>
  );
}

export default App;
