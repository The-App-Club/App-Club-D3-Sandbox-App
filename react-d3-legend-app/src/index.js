import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as d3 from "d3";
const categories = [
  "Engineering",
  "Business",
  "Physical Sciences",
  "Law & Public Policy",
  "Computers & Mathematics",
  "Agriculture & Natural Resources",
  "Industrial Arts & Consumer Services",
  "Arts",
  "Health",
  "Social Science",
];

const data = [
  { id: 1, value: 1 },
  { id: 2, value: 4 },
  { id: 3, value: 9 },
  { id: 4, value: 16 },
  { id: 5, value: 25 },
  { id: 6, value: 36 },
  { id: 7, value: 49 },
  { id: 8, value: 64 },
  { id: 9, value: 81 },
  { id: 10, value: 100 },
].map((d, i) => {
  return {
    ...d,
    category: categories[i],
  };
});

const App = () => {
  const legendDomRef = useRef(null);

  useEffect(() => {
    const height = 300;
    const width = 300;
    const svg = d3
      .select(legendDomRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewbox", `0 0 ${width} ${height}`)
      .attr("class", "label");
    const categoryColorScale = d3.scaleOrdinal(categories, d3.schemeCategory10);
    const margin = {
      top: 30,
      bottom: 30,
      left: 20,
      right: 50,
    };
    const yScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.top, height - margin.bottom]);
    svg
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        return `translate(${margin.left},${yScale(i)})`;
      })
      .call(function (o) {
        o.append("circle")
          .attr("r", function (d, i) {
            return 10;
          })
          .attr("fill", function (d, i) {
            return categoryColorScale(d.category);
          });
        o.append("g")
          .attr("class", "label")
          .attr("transform", function (d, i) {
            return `translate(15,5)`;
          })
          .append("text")
          .text(function (d, i) {
            return d.category;
          });
      });
  }, [legendDomRef]);

  return <svg ref={legendDomRef} width={300} height={300}></svg>;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
