import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [url, setUrl] = useState('');

  const handleAnalyze = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/run-puppeteer', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
      }),
    })
    .then((res) => res.json())
    .then((result) => {
      setData(result);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="App">
      <h1>Advanced Sitesnap</h1>
      <input 
      type="text" 
      placeholder="url" 
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAnalyze();
        }
      }}/>
      <p>Results: {data?.title}</p>
      {data?.screenshot && (
        <img src={`data:image/png;base64,${data.screenshot}`} alt="Screenshot" />
      )}
    </div>
  );
}

export default App;