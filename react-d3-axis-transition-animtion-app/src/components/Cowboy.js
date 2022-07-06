import {useRef, useEffect, useMemo} from 'react';
import * as d3 from 'd3';

const Cowboy = ({data}) => {
  const svgDomRef = useRef(null);
  const xAxisDomRef = useRef(null);
  const yAxisDomRef = useRef(null);

  const dotDomRef = useRef(null);
  // https://stackoverflow.com/a/70890849/15972569
  const collator = new Intl.Collator();
  data.sort((a, b) => {
    return collator.compare(b.name, a.name); // desc
    // return collator.compare(a.name, b.name); // asc
  });
  const height = 500;
  const width = 600;
  const margin = useMemo(() => {
    return {top: 50, left: 50, right: 10, bottom: 10};
  }, []);

  const xScale = d3
    .scaleLinear()
    .domain([
      0,
      Math.max(
        ...data.map((d) => {
          return d.x;
        })
      ),
    ])
    .range([margin.left, width - margin.left]);
  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      Math.max(
        ...data.map((d) => {
          return d.y;
        })
      ),
    ])
    .range([height - margin.top, margin.top]);

  useEffect(() => {
    d3.select(svgDomRef.current).attr('height', height).attr('width', width);

    // Add X axis
    d3.select(xAxisDomRef.current)
      .attr('transform', `translate(0, ${height - margin.top})`)
      .transition()
      .duration(500)
      .call(d3.axisBottom(xScale));

    // Add Y axis
    d3.select(yAxisDomRef.current)
      .attr('transform', `translate(${margin.left}, 0)`)
      .transition()
      .duration(500)
      .call(d3.axisLeft(yScale));

    return () => {};
  }, [data, margin, xScale, yScale]);

  return (
    <svg ref={svgDomRef} className="stage">
      <g ref={dotDomRef} className="dot"></g>
      <g ref={xAxisDomRef} className="x-axis"></g>
      <g ref={yAxisDomRef} className="y-axis"></g>
    </svg>
  );
};

export {Cowboy};
