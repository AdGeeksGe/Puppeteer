// adgeeksge/puppeteer/Puppeteer-2ec5cebc57fe0b1d1c5e42b19da82d0062171351/client/src/App.jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/run-puppeteer', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("Full server response:", JSON.stringify(result, null, 2));
      
      if (!result.analysis) {
        console.warn("Analysis is missing from response");
      } else {
        console.log("Analysis received:", result.analysis.substring(0, 100) + "...");
      }

      setData(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  console.log("Current data state:", data);
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