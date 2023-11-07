// App.js

import React from "react";
import "./style/App.css";
import WordCloud from "./components/WordCloud";

function App() {
  return (
    <div className="App">
      <h1>RSS Word Cloud</h1>
      <WordCloud />
    </div>
  );
}

export default App;
