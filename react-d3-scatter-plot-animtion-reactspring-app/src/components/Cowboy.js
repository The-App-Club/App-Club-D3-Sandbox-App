import {useRef, useEffect, useMemo} from 'react';
import * as d3 from 'd3';
// import {transform} from 'framer-motion';
import {useTransition, animated} from 'react-spring';

const Cowboy = ({data = [], minValue, maxValue}) => {
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
  const height = 800;
  const width = 1200;
  const margin = useMemo(() => {
    return {top: 50, left: 50, right: 10, bottom: 10};
  }, []);
  const xScale = d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .range([margin.left, width - margin.left]);
  const yScale = d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .range([height - margin.top, margin.top]);

  const transitions = useTransition(data, {
    key: (item) => {
      return item.name;
    },
    from: ({x, y}) => {
      return {
        x: 0,
        y: 0,
        opacity: 0,
      };
    },
    enter: ({x, y}) => {
      return {
        x: xScale(x),
        y: yScale(y),
        opacity: 1,
      };
    },
    update:
      ({x, y}) =>
      async (next) => {
        await next({
          x: xScale(x),
          y: yScale(y),
        });
      },
    leave: (item) => async (next) => {
      await next({
        opacity: 0,
      });
    },
    config: {mass: 1, tension: 50, friction: 1, frequency: 1, duration: 500},
    trail: 25,
  });

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
      <g ref={dotDomRef} className="dot">
        {transitions((style, item) => {
          const index = data.findIndex((d) => {
            return d === item;
          });
          return (
            <animated.g style={style}>
              <circle
                r={10}
                fill={d3.schemeTableau10[item.group]}
                // fill={d3.schemeTableau10[index]}
                // fill={d3.interpolateSpectral(
                //   transform([0, data.length - 1], [0, 1])(index)
                // )}
              ></circle>
            </animated.g>
          );
        })}
      </g>
      <g ref={xAxisDomRef} className="x-axis"></g>
      <g ref={yAxisDomRef} className="y-axis"></g>
    </svg>
  );
};

export {Cowboy};
