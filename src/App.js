import React from "react";
import WordCloud from "./WordCloud";

const words = [
  { text: "React", size: 30 },
  { text: "D3", size: 25 },
  { text: "Word", size: 20 },
  // Add more word objects with different sizes
];

function App() {
  return (
    <div className="App">
      <h1>Word Cloud Example</h1>
      <WordCloud words={words} />
    </div>
  );
}

export default App;
