import * as d3 from 'd3';
import {useRef, useEffect} from 'react';
import {css} from '@emotion/css';
import {useResizeObserver} from '../hooks/useResizeObserver';
import * as R from 'ramda';
import {transform} from 'framer-motion';

const Cowboy = ({data}) => {
  const circlesDomRef = useRef(null);
  const wrapperRef = useRef();
  const dimensions = useResizeObserver({ref: wrapperRef});
  const majorRadius = 50;

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function getCurrentAngle(el) {
    let x = d3.select(el).attr('cx');
    let y = d3.select(el).attr('cy');
    return Math.atan2(y, x);
  }
  function seek(dom, t, currentAngle, targetAngle) {
    const i = d3.interpolate(currentAngle, targetAngle);
    const angle = i(t);
    d3.select(dom)
      .attr('cx', majorRadius * Math.cos(angle))
      .attr('cy', majorRadius * Math.sin(angle));
  }
  useEffect(() => {
    if (!dimensions) {
      return;
    }

    d3.select(circlesDomRef.current)
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('r', 10)
      .transition()
      .duration(1000)
      .attrTween('circumference', function (d) {
        const dom = this;
        const currentAngle = getCurrentAngle(dom);
        const targetAngle = d;
        return (t) => {
          const p = R.clamp(0, 1, t);
          seek(dom, p, currentAngle, targetAngle);
        };
      })
      .attr('fill', function (d, i) {
        return d3.interpolateGreens(transform([0, data.length - 1], [0, 1])(i));
      });
  }, [data]);
  return (
    <div ref={wrapperRef}>
      <svg
        width="300"
        height="300"
        className={css`
          display: block;
          width: 100%;
        `}
      >
        <g transform="translate(10, 10)">
          <circle
            cx="50"
            cy="50"
            r={majorRadius}
            className={css`
              fill: none;
              stroke: #000;
            `}
          />
          <g
            ref={circlesDomRef}
            className="circles"
            transform="translate(50, 50)"
          ></g>
        </g>
      </svg>
    </div>
  );
};

export {Cowboy};
