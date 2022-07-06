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
    var data = [
      'Cat A',
      'Cat B',
      'Cat C',
      'Cat D',
      'Dog A',
      'Dog B',
      'Dog C',
      'Dog D',
    ];
    var n = data.length / 2; // distribute
    var itemWidth = 80;
    var itemHeight = 18;

    var svg = d3
      .select(legendRef.current)
      .append('svg')
      .attr('width', window.innerWidth)
      .attr('height', itemHeight * 4);

    var color = colorbrewer.Greens[8];

    var legend = svg
      .selectAll('.legend')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', `translate(${30}, ${20})`)
      .append('g')
      .attr('transform', function (d, i) {
        return (
          'translate(' +
          (i % n) * itemWidth +
          ',' +
          Math.floor(i / n) * (itemHeight + 10) +
          ')'
        );
      })
      .attr('class', 'legend');

    var rects = legend
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', function (d, i) {
        return color[i];
      });

    var text = legend
      .append('text')
      .attr('x', 15)
      .attr('y', 12)
      .text(function (d) {
        return d;
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
