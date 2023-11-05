import React, { Component } from "react";
import axios from "axios";
import * as d3 from "d3";
import cloud from "d3-cloud";

class WordCloud extends Component {
  constructor() {
    super();
    this.state = {
      wordCloudData: [],
    };
  }

  componentDidMount() {
    this.fetchWordCloudData();
  }

  fetchWordCloudData() {
    axios
      .post("http://localhost:8080/api/wordcloud/generate", {
        rssFeedUrl: "http://rss.cnn.com/rss/edition.rss", // Replace with a valid RSS feed URL
        wordFrequencyThreshold: 3, // Adjust the threshold as needed
      })
      .then((response) => {
        const wordFrequencies = response.data.wordFrequencies;
    
        // Transform data to an array of objects
        const transformedData = Object.entries(wordFrequencies).map(([word, frequency]) => ({
          text: word,
          size: frequency
        }));
    
        this.setState({ wordCloudData: transformedData }, () => {
          this.createWordCloud();
        });
      })
      .catch((error) => {
        console.error("Error fetching word cloud data:", error);
      });
  }

  createWordCloud() {
    const wordFrequencies = this.state.wordCloudData;
    const layout = cloud()
      .size([800, 600]) // Adjust the size as needed
      .words(wordFrequencies)
      .padding(5)
      .rotate(0)
      .fontSize((d) => d.size)
      .on("end", this.drawWordCloud);

    layout.start();
  }

  drawWordCloud(words) {
    d3.select("#word-cloud")
      .append("svg")
      .attr("width", 800) // Adjust the width as needed
      .attr("height", 600) // Adjust the height as needed
      .append("g")
      .attr("transform", "translate(400,300)")
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", (d) => `${d.size}px`)
      .style("fill", "steelblue") // Adjust the color as needed
      .attr("text-anchor", "middle")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .text((d) => d.text);
  }

  render() {
    return <div id="word-cloud"></div>;
  }
}

export default WordCloud;
