// adgeeksge/puppeteer/Puppeteer-2ec5cebc57fe0b1d1c5e42b19da82d0062171351/client/src/App.jsx
import React, { useState } from 'react';
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
  console.error("Data:", data);
  return (
    <div className="App">
      <h1>Advanced Sitesnap</h1>
      <input
        type="text"
        placeholder="Enter a URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAnalyze();
          }
        }}
      />
      <button onClick={handleAnalyze}>Analyze</button>

      {/* This is the crucial fix! Only render this block if data exists. */}
      {data && (
        <div>
          <h2>Results: {data.title}</h2>
          {data.screenshot && (
            <img src={`data:image/png;base64,${data.screenshot}`} alt="Screenshot" style={{maxWidth: '100%'}} />
          )}
          {data.analysis && (
            <div>
              <h3>Analysis from Gemini:</h3>
              <p style={{textAlign: 'left', whiteSpace: 'pre-wrap'}}>{data.analysis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;