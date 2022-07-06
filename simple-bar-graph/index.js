import * as d3 from "d3";

const chartdata = [40, 60, 80, 100, 70, 120, 100, 60, 70, 150, 120, 140];
const height = 300;
const width = 500;
const barWidth = 20;
const barOffset = 20;

// https://chartio.com/resources/tutorials/how-to-resize-an-svg-when-the-window-is-resized-in-d3-js/
const a = d3
  .select(".workspace")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .style("background", "#dff0d8");

a.selectAll("svg")
  .data(chartdata)
  .enter()
  .append("rect")
  .style("fill", "#3c763d")
  .attr("width", barWidth)
  .attr("height", (data) => {
    return data;
  })
  .attr("x", (data, i) => {
    return i * (barWidth + barOffset);
  })
  .attr("y", (data) => {
    return height - data;
  });
