import * as d3 from "d3";

const height = 500;
const width = 860;

const svg = d3
.select(".workspace")
.append("svg")
.attr('width', '100%')
.attr('viewBox', `0 0 ${width} ${height}`);
// http://jsfiddle.net/6286X/4/
// https://stackoverflow.com/questions/38987181/d3-listening-to-end-event-of-a-transition/38987236
// https://stackoverflow.com/questions/40845121/where-is-d3-svg-diagonal
const data = {
  source: {
    x: 120,
    y: 110,
  },
  target: {
    x: 580,
    y: 300,
  },
};

const link = d3
  .linkHorizontal()
  .x(function (d) {
    return d.x;
  })
  .y(function (d) {
    return d.y;
  });

const circle = d3
  .select("svg")
  .append("circle")
  .attr("fill", "red")
  .attr("r", 20)
  .attr("transform", "translate(0,0)")
  .attr("class", "circle");

const path = svg
  .append("path")
  .attr("d", link(data))
  .style("stroke", "black")
  .style("stroke-width", 5)
  .style("fill", "none");

function transition() {
  circle
    .transition()
    .duration(10000)
    .attrTween("transform", translateAlong(path.node()))
    .on("end", transition);
}

function translateAlong(path) {
  const l = path.getTotalLength();
  return function (d, i, a) {
    return function (t) {
      const p = path.getPointAtLength((1 - t) * l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}

transition();
