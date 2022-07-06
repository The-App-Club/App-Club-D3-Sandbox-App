import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./index.css";

import * as d3 from "d3";

const StyledWorkSpace = styled.div`
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
`;

const App = () => {
  const wrkspRef = useRef(null);

  useEffect(() => {
    const height = 300;
    const width = 300;

    const dataset = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 4 },
      { x: 3, y: 9 },
      { x: 4, y: 16 },
      { x: 5, y: 25 },
      { x: 6, y: 36 },
      { x: 7, y: 49 },
      { x: 8, y: 64 },
      { x: 9, y: 81 },
      { x: 10, y: 100 },
    ];

    const margin = { top: 50, left: 50, right: 10, bottom: 10 };

    const svg = d3
      .select(wrkspRef.current)
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .style("border", "1px solid #000");

    const xScale = d3.scaleLinear(
      d3.extent(dataset, (d) => d.x),
      [margin.left, width - margin.left]
    );

    const yScale = d3.scaleLinear(
      d3.extent(dataset, (d) => d.y),
      [height - margin.top, margin.top]
    );

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.top})`)
      .call(d3.axisBottom(xScale));

    // Add Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    svg
      .append("g")
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("r", 3)
      .transition()
      .duration(300)
      .delay((d, i) => {
        return i * 2;
      })
      .ease(d3.easeBackInOut)
      .attr("cx", (d, i) => {
        return xScale(d.x);
      })
      .attr("cy", (d, i) => {
        return yScale(d.y);
      })
      .attr("fill", "black");
  }, [wrkspRef]);

  return <StyledWorkSpace ref={wrkspRef}></StyledWorkSpace>;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
