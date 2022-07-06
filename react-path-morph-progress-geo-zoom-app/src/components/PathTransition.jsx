import {css} from '@emotion/css';
import {useRef, useEffect, useState, useCallback} from 'react';
import {transform} from 'framer-motion';
import * as d3 from 'd3';
import {useResizeObserver} from '../hooks/useResizeObserver';
import {interpolatePath} from 'd3-interpolate-path';
import {samples} from 'culori';

const width = 300;
const height = 350;

const matcher = (array = [], value) => {
  const result = array.findIndex((item) => {
    return item[0] <= value && value <= item[1];
  });
  return result;
};

const zoomList = [
  `M28.571935778615853,273.20763733952816L0,250.1977317026835L52.41341861375781,78.79236266047178L300.68335726406394,82.27592721863874L302.0000000000002,265.9530948905642L80.04714789191985,264.3917768278866Z`,
  `M157.24706336062235,351.99999999999994L156.09252423986692,351.07021223803423L158.21045362032578,344.1440380508843L168.24258301121765,344.284802456672L168.29578611087723,351.7068573468242L159.32708155030596,351.6437673693978Z`,
  `M28.571935778615853,273.20763733952816L0,250.1977317026835L52.41341861375781,78.79236266047178L300.68335726406394,82.27592721863874L302.0000000000002,265.9530948905642L80.04714789191985,264.3917768278866Z`,
];

const zoomPairs = d3.pairs(zoomList);
const nuts = samples(zoomList.length);
const progressPairs = d3.pairs(nuts);

const PathTransition = ({debugProgress}) => {
  const svgDomRef = useRef();
  const wrapperRef = useRef();
  const stageDomRef = useRef();
  const pathDomRef = useRef();
  const dimensions = useResizeObserver({ref: wrapperRef});

  const niceMorph = useCallback(({t, dPath1, dPath2}) => {
    d3.select(pathDomRef.current)
      .transition()
      .duration(750)
      .attrTween('d', function () {
        const node = pathDomRef.current;
        const length = node.getTotalLength();
        return () => {
          return interpolatePath(dPath1, dPath2)(t);
        };
      });
  }, []);

  useEffect(() => {
    const matchIndex = matcher(progressPairs, debugProgress);
    const [zoomStart, zoomEnd] = zoomPairs[matchIndex];
    const progressPair = progressPairs[matchIndex];
    const p = transform(progressPair, [0, 1])(debugProgress);
    niceMorph({t: p, dPath1: zoomStart, dPath2: zoomEnd});
  }, [debugProgress]);

  return (
    <div ref={wrapperRef}>
      <svg
        ref={svgDomRef}
        className={css`
          width: 100%;
          display: block;
          border: 1px solid;
        `}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g ref={stageDomRef}>
          <path ref={pathDomRef} />
        </g>
      </svg>
    </div>
  );
};

export {PathTransition};
