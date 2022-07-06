import {useRef, useEffect} from 'react';
import {cx, css} from '@emotion/css';
import * as d3 from 'd3';
import {useResizeObserver} from '../hooks/useResizeObserver';
import {useMedia} from '../hooks/useMedia';

const Cowboy = ({data, maxHeight = 300, mode, minValue, maxValue}) => {
  if (mode === 'next') {
    data.sort((a, b) => {
      return a.date - b.date;
    });
    data = data.slice(-7);
  }
  if (mode === 'prev') {
    data.sort((a, b) => {
      return b.date - a.date;
    });
    data = data.slice(-7);
  }
  if (mode === 'reset') {
    // nothing
  }
  if (mode === 'restore') {
    // nothing
  }
  if (mode === 'update') {
    // nothing
  }
  const graphDomRef = useRef(null);
  const svgDomRef = useRef(null);
  const xAxisDomRef = useRef(null);
  const yAxisDomRef = useRef(null);
  const dotDomRef = useRef(null);
  const lineDomRef = useRef(null);
  const columns = useMedia({
    queries: [
      '(min-width: 1500px)',
      '(min-width: 1000px)',
      '(min-width: 600px)',
      '(min-width: 300px)',
    ],
    values: [
      {tick: d3.timeDay, fmt: `%a %m/%d`},
      {tick: d3.timeDay, fmt: `%a %m/%d`},
      {tick: d3.timeDay, fmt: `%a %m/%d`},
      {tick: d3.timeDay, fmt: `%a %m/%d`},
    ],
    defaultValue: {tick: d3.timeDay, fmt: `%a %m/%d`},
    // values: [5, 4, 3, 2],
    // defaultValue: 2,
  });
  const dimensions = useResizeObserver({ref: graphDomRef});

  useEffect(() => {
    const svg = d3.select(svgDomRef.current);
    svg.attr('height', maxHeight);
    const margin = {top: 50, left: 50, right: 10, bottom: 10};
    if (!dimensions) {
      return;
    }
    const xScale = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.date;
        })
      )
      .range([margin.left, dimensions.width - margin.left]);

    const yScale = d3
      .scaleLinear()
      .domain([
        minValue,
        maxValue,
        // d3.max(data, function (d) {
        //   return +d.value;
        // }),
      ])
      .range([dimensions.height - margin.top, margin.top])
      .nice();

    // Add the line
    d3.select(lineDomRef.current)
      .attr('transform', `translate(${-0}, 0)`)
      .select('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'orange')
      .attr('stroke-width', 3)
      .transition()
      .duration(750)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return xScale(d.date);
          })
          .y(function (d) {
            return yScale(d.value);
          })
      );

    d3.select(dotDomRef.current)
      .attr('transform', `translate(${-0}, 0)`)
      .selectAll('.dot')
      .data(data)
      .join('circle')
      .attr('class', 'dot')
      .attr('r', 5)
      .transition()
      .duration(750)
      .attr('cx', function (d) {
        return xScale(d.date);
      })
      .attr('cy', function (d) {
        return yScale(d.value);
      })
      .attr('fill', 'darkorange');

    // Add X axis
    d3.select(xAxisDomRef.current)
      .attr('transform', `translate(0, ${dimensions.height - margin.top})`)
      .transition()
      .duration(500)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(columns.tick)
          .tickFormat(d3.timeFormat(columns.fmt))
      )
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-0.75rem')
      .attr('dy', '0.15rem')
      .attr('transform', 'rotate(-65)');

    // Add Y axis
    d3.select(yAxisDomRef.current)
      .attr('transform', `translate(${margin.left}, 0)`)
      .transition()
      .duration(500)
      .call(d3.axisLeft(yScale));

    return () => {};
  }, [data, dimensions, maxHeight, columns]);

  return (
    <div ref={graphDomRef}>
      <svg
        ref={svgDomRef}
        className={cx(
          css`
            background: hsl(0, 100%, 100%);
            overflow: visible;
            display: block;
            width: 100%;
          `,
          `stage`
        )}
      >
        <g ref={dotDomRef} className="dot"></g>
        <g ref={lineDomRef} className="line">
          <path />
        </g>
        <g ref={xAxisDomRef} className="x-axis"></g>
        <g ref={yAxisDomRef} className="y-axis"></g>
      </svg>
    </div>
  );
};

export {Cowboy};
