import React, {useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {css} from '@emotion/css';
import * as d3 from 'd3';
import groupBy from 'group-by';
import colorbrewer from 'colorbrewer';
import {legendColor} from 'd3-svg-legend';
const App = () => {
  const graphRef = useRef(null);
  const legendRef = useRef(null);

  useEffect(() => {
    let xLabels = ['ATL', 'BOS', 'BWI'];
    let svg = d3
        .select(graphRef.current)
        .append('svg')
        .attr('width', 320)
        .attr('height', 300),
      margin = {top: 30, bottom: 30, left: 40, right: 10},
      width = svg.attr('width') - margin.left - margin.right,
      height = svg.attr('height') - margin.top - margin.bottom;

    const rankData = colorbrewer.Blues[8];
    let xScale = d3
        .scaleBand()
        .range([margin.left, margin.left + width])
        .padding(0.45),
      yScale = d3.scaleLinear().range([height + margin.top, margin.top]),
      // colorScale = d3.scaleSequential().interpolator(d3.interpolateBlues)
      colorScale = d3.scaleQuantize().range(rankData);

    d3.csv(
      'https://corgis-edu.github.io/corgis/datasets/csv/airlines/airlines.csv',
      (d) => {
        return {
          code: d['Airport.Code'],
          year: +d['Time.Year'],
          month: +d['Time.Month'],
          flights: +d['Statistics.Flights.Total'],
        };
      }
    ).then((dataset) => {
      let data = [];
      dataset.forEach((elem) => {
        if (
          elem.year === 2012 &&
          elem.month === 11 &&
          xLabels.includes(elem.code)
        ) {
          data.push(elem);
        }
      });
      data.sort((a, b) => a.flights - b.flights);
      let xSeq = [];
      data.forEach((elem) => xSeq.push(elem.code));
      console.log(data);

      xScale.domain(xSeq);
      yScale.domain([0, d3.max(data, (d) => d.flights)]);
      colorScale.domain([0, d3.max(data, (d) => d.flights)]);

      svg
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.code))
        .attr('y', (d) => yScale(d.flights))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => height + margin.top - yScale(d.flights))
        .attr('fill', (d) => colorScale(d.flights));

      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margin.left)
        .attr('y', margin.top / 2)
        .text('Airport Flights Number in Nov 2012');

      svg
        .append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, ' + (height + margin.top) + ')')
        .call(d3.axisBottom(xScale).tickValues(xLabels))
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margin.left)
        .attr('y', margin.bottom / 2)
        .text('Airport');

      svg
        .append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + margin.left + ', 0)')
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('~s')))
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2 - margin.top)
        .attr('y', -margin.left / 2)
        .text('Total Flights');

      let legend = legendColor()
        .labelFormat(d3.format('.2s'))
        .title('Color Legend')
        .scale(colorScale);

      const legendSvg = d3
        .select(legendRef.current)
        .append('svg')
        .attr('width', 320)
        .attr('height', 200)
        .style('font-size', 12);

      legendSvg
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${margin.left}, ${10})`)
        .call(legend);
    });
  }, [graphRef]);

  return (
    <>
      <div ref={graphRef} className={css``}></div>
      <div ref={legendRef} className={css``}></div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
