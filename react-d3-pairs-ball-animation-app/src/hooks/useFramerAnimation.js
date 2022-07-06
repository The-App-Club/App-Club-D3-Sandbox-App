import {useRef, useEffect} from 'react';
import {useMotionValue, animate} from 'framer-motion';
import * as R from 'ramda';

const useFramerAnimation = (duration = 5, callback) => {
  // move to 0 >>> 100 duration 5s
  // so that, get progress 0 >>> 1
  const x = useMotionValue(0);
  useEffect(() => {
    const controls = animate(x, 100, {
      duration,
      repeat: Infinity,
      onUpdate: (t) => {
        callback(R.clamp(0, 1, t / 100));
      },
      onRepeat: () => {
      },
      onComplete: () => {
      },
    });
    return controls.stop;
  }, []);
};

export {useFramerAnimation};
