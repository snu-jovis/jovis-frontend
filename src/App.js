import './App.css';
import Layout from './components/Layout';
import React from 'react';

import { HistoryProvider } from './components/providers/HistoryProvider';

function App() {
  return (
    <div className="App">
      <HistoryProvider>
        <Layout/>
      </HistoryProvider>
    </div>
  );
}

export default App;
