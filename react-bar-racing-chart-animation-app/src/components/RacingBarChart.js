import {useRef, useEffect} from 'react';
import * as d3 from 'd3';
import {css} from '@emotion/css';
import {useResizeObserver} from '../hooks/useResizeObserver';
import {formatCount} from '../plugins/count';
const RacingBarChart = ({data, maxHeight = 300}) => {
  const svgDomRef = useRef();
  const graphDomRef = useRef();
  const dimensions = useResizeObserver({ref: graphDomRef});

  useEffect(() => {
    const svg = d3.select(svgDomRef.current);
    svg.attr('height', maxHeight);
    if (!dimensions) {
      return;
    }

    // sorting the data
    data.sort((a, b) => {
      return b.value - a.value; //desc
      // return a.value - b.value; //asc
    });

    const yScale = d3
      .scaleBand()
      .domain(
        data.map((d, i) => {
          return i;
        })
      )
      .range([0, dimensions.height])
      .padding(0.1);

    const xScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => {
          return d.value;
        }),
      ])
      .range([0, dimensions.width]);

    // draw the bars
    svg
      .selectAll('.bar')
      .data(data, (d, i) => {
        return d.name;
      })
      .join(
        (enter) =>
          enter.append('rect').attr('y', (d, i) => {
            return yScale(i);
          }),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr('fill', (d, i) => {
        return d.color;
      })
      .attr('class', 'bar')
      .attr('height', yScale.bandwidth())
      .attr('x', 0)
      .transition()
      .ease(d3.easeCubicInOut)
      .attr('width', (d) => {
        return xScale(d.value);
      })
      .attr('y', (d, i) => {
        return yScale(i);
      });

    svg
      .selectAll('.point')
      .data(data, (d, i) => {
        return d.name;
      })
      .join((enter) =>
        enter
          .append('text')
          .attr('y', (d, i) => yScale(i) + yScale.bandwidth() / 2 + 5)
      )
      .text((d, i) => {
        return `${formatCount({count: d.value, base: 10})} points`;
      })
      .attr('class', 'point')
      .transition()
      .attr('x', (d, i) => {
        return xScale(d.value) + 10;
      })
      .ease(d3.easeCubicInOut)
      .attr('y', (d, i) => yScale(i) + yScale.bandwidth() / 2 + 5);

    svg
      .selectAll('.name')
      .data(data, (d, i) => {
        return d.name;
      })
      .join((enter) =>
        enter
          .append('text')
          .attr('y', (d, i) => yScale(i) + yScale.bandwidth() / 2 + 5)
      )
      .text((d, i) => {
        return `${d.name}`;
      })
      .attr('class', 'name')
      .attr('x', -110)
      .transition()
      .ease(d3.easeCubicInOut)
      .attr('y', (d, i) => yScale(i) + yScale.bandwidth() / 2 + 5);
  }, [data, dimensions, maxHeight]);

  return (
    <div ref={graphDomRef} className={css``}>
      <svg
        ref={svgDomRef}
        className={css`
          background: hsl(0, 100%, 100%);
          overflow: visible;
          display: block;
          width: 100%;
        `}
      ></svg>
    </div>
  );
};

export {RacingBarChart};
