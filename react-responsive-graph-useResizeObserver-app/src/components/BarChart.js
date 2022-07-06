import {useRef, useEffect} from 'react';
import {css} from '@emotion/css';
import * as R from 'ramda';
import * as d3 from 'd3';
import {transform} from 'framer-motion';
import {useResizeObserver} from '../hooks/useResizeObserver';

const BarChart = ({data, maxHeight = 300}) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver({ref: wrapperRef});

  // will be called initially and on every data change
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.attr('height', maxHeight);

    if (!dimensions) {
      return;
    }

    const xScale = d3
      .scaleBand()
      .domain(
        data.map((d, i) => {
          return i;
        })
      )
      .range([0, dimensions.width])
      .padding(0.5);

    const yList = data.map((d, i) => {
      return d.y;
    });

    const yScale = d3
      .scaleLinear()
      .domain([Math.min(...yList), Math.max(...yList)])
      .range([maxHeight, 0]);

    const colorScale = d3.interpolateTurbo;

    // create x-axis
    const xAxis = d3.axisBottom(xScale);
    svg
      .select('.x-axis')
      .style('transform', `translateY(${dimensions.height}px)`)
      .call(xAxis);

    // create y-axis
    const yAxis = d3.axisRight(yScale);
    svg
      .select('.y-axis')
      .style('transform', `translateX(${dimensions.width}px)`)
      .call(yAxis);

    // draw the bars
    svg
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .style('transform', 'scale(1, -1)')
      .attr('x', (d, i) => {
        return xScale(i);
      })
      .attr('y', -dimensions.height)
      .attr('width', xScale.bandwidth())
      .transition()
      .ease(d3.easeCubicInOut)
      .attr('fill', (d, i) => {
        return colorScale(transform([0, data.length], [0.5, 1])(i));
      })
      .attr('height', (d, i) => {
        return R.clamp(0, dimensions.height, dimensions.height - yScale(d.y));
      });
  }, [data, dimensions, maxHeight]);

  return (
    <div ref={wrapperRef}>
      <svg
        ref={svgRef}
        className={css`
          background: hsl(0, 100%, 100%);
          overflow: visible;
          display: block;
          width: 100%;
        `}
      >
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};

export {BarChart};
