import {transform, useMotionValue, animate} from 'framer-motion';
import * as d3 from 'd3';
import {samples} from 'culori';
import {default as lerp} from 'lerp';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {css} from '@emotion/css';
import {default as chance} from 'chance';

const matcher = (array = [], value) => {
  const result = array.findIndex((item) => {
    return item[0] <= value && value <= item[1];
  });
  return result;
};

const Object = ({
  startPoint,
  step = 5,
  width,
  height,
  size = 50,
  progress,
  color,
}) => {
  const [pos, setPos] = useState({x: startPoint[0], y: startPoint[1]});
  const stepList = useMemo(() => {
    return [...Array(step).keys()].map((n, index) => {
      return chance().integer({min: 0, max: width - size});
    });
  }, [step]);

  const data = useMemo(() => {
    const result = [startPoint];
    result.push(...d3.pairs(stepList));
    result.push(startPoint);
    return result;
  }, [startPoint]);
  const translatePairs = useMemo(() => {
    return d3.pairs(data);
  }, [data]);
  const nuts = useMemo(() => {
    return samples(data.length);
  }, [data]);
  const progressPairs = useMemo(() => {
    return d3.pairs(nuts);
  }, [nuts]);

  useEffect(() => {
    const matchIndex = matcher(progressPairs, progress);
    const [translateStart, translateEnd] = translatePairs[matchIndex];
    const progressPair = progressPairs[matchIndex];
    const p = transform(progressPair, [0, 1])(progress);
    const x = lerp(translateStart[0], translateEnd[0], p);
    const y = lerp(translateStart[1], translateEnd[1], p);
    setPos({x, y});
  }, [progress]);
  return (
    <div
      className={css`
        position: absolute;
        top: ${pos.y}px;
        left: ${pos.x}px;
        background: ${color};
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
      `}
    ></div>
  );
};

export {Object};
