import * as d3 from "d3";
import { easeLinear } from "d3-ease";
import data from "./sample.json";

const height = 300;
const width = 300;

const svg = d3
  .select(".workspace")
  .append("svg")
  .attr("width", `${width}`)
  .attr("height", `${height}`)
  .attr("viewBox", `0 0 ${width} ${height}`);

const link = d3
  .line()
  .x(function (d) {
    return d.day;
  })
  .y(function (d) {
    return d.rank;
  });

// https://stackoverflow.com/questions/47587833/d3-stop-and-restart-transition-along-path-to-allow-click-through-to-geo-data-coo
const path = svg
  .append("path")
  .attr("d", link(data))
  .style("stroke", "black")
  .style("stroke-width", 1)
  .style("fill", "none");

const ball = svg.append("circle").attr("r", 11).attr("fill", "orange");

function transition(s = 0.1) {
  ball
    .transition()
    .ease(easeLinear)
    .attrTween("transform", function () {
      const node = path.node();
      const length = node.getTotalLength();
      return ()=>{return seek(s, length, node)};
    });
}

function seek(t, length, node) {
  const p = node.getPointAtLength((1 - t) * length);
  return "translate(" + p.x + "," + p.y + ")";
}

transition(0.8);
