import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const WordCloud = ({ words }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Create a word cloud layout
    const layout = cloud()
      .size([500, 500])
      .words(words)
      .padding(5)
      .rotate(0)
      .font("Impact")
      .fontSize((d) => d.size)
      .on("end", draw);

    layout.start();

    function draw(words) {
      d3.select(svgRef.current)
        .append("g")
        .attr("transform", "translate(250,250)")
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.size}px`)
        .style("font-family", "Impact")
        .style("fill", (d, i) => d3.schemeCategory10[i % 10])
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${[d.x, d.y]})`)
        .text((d) => d.text);
    }
  }, [words]);

  return (
    <div>
      <svg ref={svgRef} width="500" height="500"></svg>
    </div>
  );
};

export default WordCloud;
