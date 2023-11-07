import React, { Component } from "react";
import axios from "axios";
import * as d3 from "d3";
import cloud from "d3-cloud";
import getRandomColor from "../components/GetRandomColor";

export default class WordCloud extends Component {
  constructor() {
    super();
    this.state = {
      rssFeedUrl: "http://rss.cnn.com/rss/edition_travel.rss", // Default RSS feed URL
      wordCloudData: [],
    };
  }

  componentDidMount() {
    this.fetchWordCloudData();
  }

  fetchWordCloudData() {
    const { rssFeedUrl } = this.state;
    axios
      .post("http://localhost:8080/api/v1/wordcloud/generate", {
        rssFeedUrl,
        wordFrequencyThreshold: 2, // Adjust the threshold as needed
      })
      .then((response) => {
        const wordFrequencies = response.data.wordFrequencies;

        // Transform data to an array of objects
        const transformedData = Object.entries(wordFrequencies).map(
          ([word, frequency]) => ({
            text: word,
            size: frequency,
          })
        );

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

    // Combine and sum the frequencies for duplicate words
    const wordFrequenciesMap = new Map();
    wordFrequencies.forEach((wordObj) => {
      const text = wordObj.text;
      const size = wordObj.size;
      if (wordFrequenciesMap.has(text)) {
        wordFrequenciesMap.set(text, wordFrequenciesMap.get(text) + size);
      } else {
        wordFrequenciesMap.set(text, size);
      }
    });

    // Convert the Map back to an array of objects
    const uniqueWordFrequencies = Array.from(
      wordFrequenciesMap,
      ([text, size]) => ({ text, size })
    );

    const layout = cloud()
      .size([800, 600]) // Adjust the size as needed
      .words(uniqueWordFrequencies) // Use the deduplicated data
      .padding(5)
      .rotate(0)
      .fontSize((d) => d.size * 10)
      .on("end", this.drawWordCloud)
      .start();
  }

  drawWordCloud(words) {
    d3.select("#word-cloud svg").remove(); // Remove the previous word cloud

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
      .style("fill", () => getRandomColor()) // Adjust the color as needed
      .attr("text-anchor", "start")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .text((d) => d.text);
  }

  handleInputChange = (event) => {
    this.setState({ rssFeedUrl: event.target.value });
  };

  handleRefreshClick = () => {
    this.fetchWordCloudData();
  };

  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Enter RSS feed URL"
          value={this.state.rssFeedUrl}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleRefreshClick}>Refresh Word Cloud</button>
        <div id="word-cloud"></div>
      </div>
    );
  }
}
