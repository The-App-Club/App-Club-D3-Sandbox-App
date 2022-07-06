import {useEffect, useState, useRef, useMemo} from 'react';
import * as d3 from 'd3';
import {css} from '@emotion/css';
import * as R from 'ramda';
import {transform} from 'framer-motion';
import {useResizeObserver} from '../hooks/useResizeObserver';

const roundUp = (num, precision) => {
  // https://stackoverflow.com/a/5191133/15972569
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
};
const Graph = ({data, binSize, maxHeight = 300}) => {
  const wrapperRef = useRef();
  const dimensions = useResizeObserver({ref: wrapperRef});
  const svgDomRef = useRef(null);
  const histDomRef = useRef(null);
  const xAxisDomRef = useRef(null);
  const yAxisDomRef = useRef(null);
  const xAxisLabelDomRef = useRef(null);
  const yAxisLabelDomRef = useRef(null);
  const graphTitleDomRef = useRef(null);

  const height = 500;
  const width = 600;

  const margin = useMemo(() => {
    return {top: 50, left: 50, right: 10, bottom: 10};
  }, []);

  const maxData = d3.max(data, function (d) {
    return +d;
  });

  useEffect(() => {
    const svg = d3.select(svgDomRef.current);
    svg.attr('height', maxHeight);

    if (!dimensions) {
      return;
    }
    const xScale = d3
      .scaleLinear()
      .domain([0, roundUp(maxData, -1)])
      .range([margin.left, dimensions.width - margin.left]);

    const yScale = d3
      .scaleLinear()
      .range([dimensions.height - margin.top, margin.top]);

    const histogram = d3
      .histogram()
      .value(function (d) {
        return d;
      })
      .domain(xScale.domain())
      .thresholds(xScale.ticks(binSize));
    const bins = histogram(data);
    console.log(bins);

    const maxBinLength = d3.max(bins, function (d) {
      return d.length;
    });

    yScale.domain([0, maxBinLength]).nice();

    d3.select(histDomRef.current)
      .selectAll('rect')
      .data(bins)
      .join('rect')
      .transition()
      .duration(750)
      .attr('transform', function (d) {
        return 'translate(' + xScale(d.x0) + ',' + yScale(d.length) + ')';
      })
      .attr('width', function (d) {
        return Math.max(0, xScale(d.x1) - xScale(d.x0));
      })
      .attr('height', function (d) {
        return Math.max(0, dimensions.height - yScale(d.length) - margin.top);
      })
      .style('fill', '#69b3a2');

    d3.select(xAxisDomRef.current)
      .attr('transform', `translate(0, ${dimensions.height - margin.top})`)
      .transition()
      .duration(500)
      .call(
        d3.axisBottom(xScale).ticks(2) // pc >>> maxBinLength sp >>> 2
      );

    d3.select(yAxisDomRef.current)
      .attr('transform', `translate(${margin.left}, 0)`)
      .transition()
      .duration(500)
      .call(d3.axisLeft(yScale));

    // https://d3-graph-gallery.com/graph/custom_axis.html
    // Add X axis label:
    d3.select(xAxisLabelDomRef.current)
      .selectAll('text')
      .data(['X axis title'])
      .join('text')
      .attr('text-anchor', 'end')
      .attr('x', dimensions.width - 30)
      .attr('y', dimensions.height - margin.top + 40)
      .text(function (d) {
        return d;
      });
    // Y axis label:
    d3.select(yAxisLabelDomRef.current)
      .selectAll('text')
      .data(['Y axis title'])
      .join('text')
      .attr('text-anchor', 'end')
      .attr('y', margin.top - 30)
      .attr('x', margin.left + 30)
      .text(function (d) {
        return d;
      });

    d3.select(graphTitleDomRef.current)
      .selectAll('text')
      .data(['Vanilla D3 Hist Bin'])
      .join('text')
      .attr('font-size', '1.2rem')
      .attr('text-anchor', 'end')
      .attr('y', margin.top - 50)
      .attr('x', (dimensions.width + margin.left) / 2 + 50)
      .text(function (d) {
        return d;
      });
  }, [data, dimensions, maxHeight, binSize]);

  return (
    <div ref={wrapperRef}>
      <svg
        ref={svgDomRef}
        className={css`
          overflow: visible;
          display: block;
          width: 100%;
        `}
      >
        <g ref={graphTitleDomRef} className={'title'}></g>
        <g ref={histDomRef} className={'hist'}></g>
        <g ref={xAxisDomRef} className={'x-axis'}></g>
        <g ref={yAxisDomRef} className={'y-axis'}></g>
        <g ref={xAxisLabelDomRef} className={'x-axis-label'}></g>
        <g ref={yAxisLabelDomRef} className={'y-axis-label'}></g>
      </svg>
    </div>
  );
};

export {Graph};
