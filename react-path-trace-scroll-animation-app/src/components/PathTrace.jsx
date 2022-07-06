import {motion, useTransform, transform} from 'framer-motion';
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/css';
import * as d3 from 'd3';
import {generatePath} from '../plugins/generatePath';
import {samples} from 'culori';

const pointList = [
  {x: 0, y: 60},
  {x: 800, y: 60},
  {x: 800, y: 150},
  {x: 550, y: 150},
  {x: 550, y: 330},
  {x: 750, y: 330},
  {x: 750, y: 430},
  {x: 950, y: 430},
  {x: 950, y: 630},
  {x: 50, y: 630},
  {x: 50, y: 430},
  {x: 550, y: 430},
  {x: 550, y: 930},
  {x: 1250, y: 930},
  {x: 1250, y: 130},
  {x: 1450, y: 130},
  {x: 1450, y: 630},
  {x: 1850, y: 630},
  {x: 1850, y: 1030},
];

const markerPointList = [
  {x: 950, y: 430},
  {x: 50, y: 630},
  {x: 1250, y: 930},
  {x: 1850, y: 630},
];

const getDomain = (data, key) => {
  const result = data.reduce(
    (acc, row) => {
      return {
        min: Math.min(acc.min, row[key]),
        max: Math.max(acc.max, row[key]),
      };
    },
    {min: Infinity, max: -Infinity}
  );
  return result;
};

const {min: minX, max: maxX} = getDomain(pointList, `x`);
const {min: minY, max: maxY} = getDomain(pointList, `y`);

const PathTrace = ({progress}) => {
  const [resized, setResized] = useState(null);
  const svgDomRef = useRef(null);
  const birdDomRef = useRef(null);
  const pathDomRef = useRef(null);

  const clampedMarkerPointList = useMemo(() => {
    return samples(markerPointList.length).map((t, index) => {
      return {
        x: transform(
          [minX, maxX],
          [minX, window.innerWidth * 0.95]
        )(markerPointList[index].x),
        y: transform(
          [minY, maxY],
          [minY, window.innerHeight * 0.95]
        )(markerPointList[index].y),
      };
    });
  }, [resized]);

  const clampedPointList = useMemo(() => {
    return samples(pointList.length).map((t, index) => {
      return {
        x: transform(
          [minX, maxX],
          [minX, window.innerWidth * 0.95]
        )(pointList[index].x),
        y: transform(
          [minY, maxY],
          [minY, window.innerHeight * 0.95]
        )(pointList[index].y),
      };
    });
  }, [resized]);

  const handleResize = useCallback(() => {
    setResized(new Date());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const ruts = useMemo(() => {
    const list = generatePath(clampedPointList, 15);
    // Zを含めて閉包しないために切り取り
    return list.slice(0, list.length - 4).join(' ');
  }, [clampedPointList]);

  const trace = useCallback((t, moveDom, pathDom) => {
    moveDom
      .transition()
      .ease(d3.easeLinear)
      .attrTween('transform', function (d) {
        return () => {
          return seek(t, pathDom.node());
        };
      });
  }, []);
  const seek = useCallback((t, pathDom) => {
    const length = pathDom.getTotalLength();
    const p = pathDom.getPointAtLength(t * length);
    // const p = pathDom.getPointAtLength((1 - t) * length);
    return 'translate(' + (p.x - 40) + ',' + (p.y - 40) + ')';
  }, []);

  useEffect(() => {
    const birdDom = d3.select(birdDomRef.current);
    const pathDom = d3.select(pathDomRef.current);
    trace(progress, birdDom, pathDom);
  }, [progress]);

  return (
    <svg
      ref={svgDomRef}
      className={css`
        display: block;
        width: 100%;
      `}
      viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
    >
      <g>
        <path
          ref={pathDomRef}
          d={ruts}
          stroke="black"
          strokeWidth="6"
          fill="none"
        />
      </g>
      <g ref={birdDomRef}>
        <image
          width={100}
          height={100}
          href={`https://img.icons8.com/stickers/100/000000/hummingbird.png`}
        ></image>
      </g>
      {clampedMarkerPointList.map((clampedMarkerPoint, index) => {
        return (
          <g
            key={index}
            transform={`translate(${clampedMarkerPoint.x - 20} ${
              clampedMarkerPoint.y - 20
            })`}
          >
            <filter id="terrain" x="0" y="0" width="100%" height="100%">
              <feTurbulence
                baseFrequency=".01"
                numOctaves="2"
                seed="10"
                type="turbulence"
              />
              <feColorMatrix type="luminanceToAlpha" />
              <feComponentTransfer>
                <feFuncA type="table" tableValues="1 0" />
              </feComponentTransfer>
            </filter>
            <image
              className={css`
                filter: hue-rotate(${(index * 80) % 280}deg);
                /* filter: url(#terrain); */
              `}
              width={50}
              height={50}
              href={`https://img.icons8.com/color/96/000000/marker--v1.png`}
            ></image>
          </g>
        );
      })}
    </svg>
  );
};

export {PathTrace};
