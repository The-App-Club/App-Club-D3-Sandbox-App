import * as d3 from "d3";

const height = 200;
const width = 300;

const svg = d3
  .select(".workspace")
  .append("svg")
  .attr("width", width)
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", `0 0 ${width} ${height}`);

const image = svg
  .append("image")
  .attr("width", "100%")
  .attr("xlink:href", "https://media.giphy.com/media/I2Yb40ZBQr4g8/giphy.gif");
