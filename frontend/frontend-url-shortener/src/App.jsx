import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleShorten = (e) => {
    if(url === "")
    {
      alert("Please enter a URL to shorten.");
      return;
    }
    axios.post("http://localhost:9000/api/createShortUrl", {url})
    .then((res)=>{
      setShortUrl(res.data);
    })
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>

      <label>Enter URL</label>

      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={handleShorten}>
        Convert to Short URL
      </button>

      <label>Short URL</label>

      <input
        type="text"
        value={shortUrl}
        placeholder="Your short URL will appear here"
        readOnly
      />
    </div>
  );
}

export default App;