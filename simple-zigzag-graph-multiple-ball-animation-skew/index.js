import * as d3 from "d3";
import { easeLinear } from "d3-ease";

import { transform } from "d3-transform";

import data from "./sample.json";

const height = 500;
const width = 860;

const svg = d3
  .select(".workspace")
  .append("svg")
  .attr("width", "100%")
  .attr("viewBox", `0 0 ${width} ${height}`);

const link = d3
  .line()
  .x(function (d) {
    return d.day;
  })
  .y(function (d) {
    return d.rank;
  });

const image = svg
  .append("defs")
  .append("pattern")
  .attr("id", "img1")
  .attr("patternUnits", "userSpaceOnUse")
  .attr("width", 100)
  .attr("height", 100)
  .append("image")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 100)
  .attr("height", 100)
  .attr("xlink:href", "https://media.giphy.com/media/I2Yb40ZBQr4g8/giphy.gif");

// http://www.boogdesign.com/examples/svg/path-pattern-fill.svg
const rect = d3
  .select("svg")
  .append("rect")
  .attr('transform', 'rotate(10 0 0)')
  .attr("fill", "url(#img1)")
  .attr("width", 100)
  .attr("height", 100);

const rect2 = d3
.select("svg")
.append("rect")
.attr("fill", "orange")
.attr("width", 100)
.attr("height", 100);

const rect3 = d3
.select("svg")
.append("rect")
.attr("fill", "green")
.attr("width", 100)
.attr("height", 100);

const path = svg
  .append("path")
  .attr("d", link(data))
  .style("stroke", "black")
  .style("stroke-width", 5)
  .style("fill", "none");

function transition(targetDom, durationTimeSeconds=1) {
  targetDom
    .transition()
    .ease(easeLinear)
    .duration(1000 * durationTimeSeconds)
    .attrTween("transform", translateAlong(path.node()))
    .on("end", ()=>{transition(targetDom, durationTimeSeconds)});
}

function translateAlong(path) {
  const l = path.getTotalLength();
  return function (d, i, a) {
    return function (t) {
      const p = path.getPointAtLength((1 - t) * l);
      return "translate(" + p.x + "," + p.y + ") rotate(90 90 0)";
    };
  };
}

transition(rect, 15);
transition(rect2, 9);
transition(rect3, 6);
