import * as d3 from 'd3';

import data from './sample.json';

const height = 500;
const width = 860;

const svg = d3
  .select('.workspace')
  .append('svg')
  .attr('width', '100%')
  .attr('viewBox', `0 0 ${width} ${height}`);

const link = d3
  .line()
  .x(function (d) {
    return d.day;
  })
  .y(function (d) {
    return d.rank;
  });

const circle = d3
  .select('svg')
  .append('circle')
  .attr('fill', 'red')
  .attr('r', 20)
  .attr('transform', 'translate(0,0)')
  .attr('class', 'circle');

const path = svg
  .append('path')
  .attr('d', link(data))
  .style('stroke', 'black')
  .style('stroke-width', 5)
  .style('fill', 'none');

function transition() {
  circle
    .transition()
    .duration(10000)
    .attrTween('transform', translateAlong(path.node()))
    .on('end', transition);
}

function translateAlong(path) {
  const l = path.getTotalLength();
  return function (d, i, a) {
    return function (t) {
      const p = path.getPointAtLength((1 - t) * l);
      return 'translate(' + p.x + ',' + p.y + ')';
    };
  };
}

transition();
