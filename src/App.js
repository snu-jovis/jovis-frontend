import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const updateValue = (event) => {
    setQuery(event.target.value);
  }

  const click = () => {
    // backend에 SQL 전송 및 결과 받아옴.
    fetch("http://localhost:8000/query/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: query })
    })
      .then(response => {
        if (response.status !== 200) {
          response.text().then(e => alert("Error: " + e));
          return
        }
        return response.json()
      })
      .then(data => setResult(data.result));    // 성공하면 결과를 result에 저장
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* 귀여운 리엑트 로고 */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* 쿼리 입력하는 곳 */}
        <span>Query:</span> 
        <input type="text" onChange={updateValue} />
        <input type="button" value="Submit" onClick={click} />

        <br /><br />
        {/* 결과 나오는 곳 */}
        <span>Result:</span>
        <p>{result}</p>
      </header>
    </div>
  );
}

export default App;
