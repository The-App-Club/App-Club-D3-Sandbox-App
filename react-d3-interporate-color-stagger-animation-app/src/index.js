import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {css} from '@emotion/css';
import {Button} from '@mui/material';
import {motion, transform} from 'framer-motion';
import * as d3 from 'd3';
import './index.scss';
import randomItem from 'random-item';

const interpolateList = [
  d3.interpolateBrBG,
  d3.interpolatePRGn,
  d3.interpolatePiYG,
  d3.interpolatePuOr,
  d3.interpolateRdBu,
  d3.interpolateRdGy,
  d3.interpolateRdYlBu,
  d3.interpolateRdYlGn,
  d3.interpolateSpectral,
  d3.interpolateBlues,
  d3.interpolateGreens,
  d3.interpolateGreys,
  d3.interpolateOranges,
  d3.interpolatePurples,
  d3.interpolateReds,
  d3.interpolateTurbo,
  d3.interpolateViridis,
  d3.interpolateInferno,
  d3.interpolateMagma,
  d3.interpolatePlasma,
  d3.interpolateCividis,
  d3.interpolateWarm,
  d3.interpolateCool,
  d3.interpolateCubehelixDefault,
  d3.interpolateBuGn,
  d3.interpolateBuPu,
  d3.interpolateGnBu,
  d3.interpolateOrRd,
  d3.interpolatePuBuGn,
  d3.interpolatePuBu,
  d3.interpolatePuRd,
  d3.interpolateRdPu,
  d3.interpolateYlGnBu,
  d3.interpolateYlGn,
  d3.interpolateYlOrBr,
  d3.interpolateYlOrRd,
  d3.interpolateRainbow,
  d3.interpolateSinebow,
];
const Loading = ({
  l = d3.interpolateBuGn,
  c = 13,
  amplitude = 50,
  duration = 2,
  startLerp = 0,
  endLerp = 1,
}) => {
  return (
    <motion.div
      className={css`
        display: flex;
      `}
      initial={'initial'}
      animate={'animate'}
      transition={{
        staggerChildren: 0.5,
      }}
    >
      {[...Array(c).keys()].map((n, index) => {
        const color = l(transform([0, c - 1], [startLerp, endLerp])(index));
        return (
          <motion.div
            key={index}
            className={css`
              border-radius: 50%;
              padding: 1rem;
              background: ${color};
            `}
            transition={{
              repeat: Infinity,
              duration: duration,
            }}
            variants={{
              initial: {
                y: amplitude,
              },
              animate: {
                y: [amplitude, 0, amplitude],
              },
            }}
          ></motion.div>
        );
      })}
    </motion.div>
  );
};

const App = () => {
  const [color, setColor] = useState(() => {
    return d3.interpolateSpectral;
  });

  const handleClick = () => {
    setColor(() => {
      return randomItem(interpolateList);
    });
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        className={css`
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
        `}
      >
        Do
      </Button>
      <div
        className={css`
          display: grid;
          place-items: center;
          width: 100%;
        `}
      >
        {[...Array(10).keys()].map((n, index) => {
          return (
            <Loading
              key={index}
              l={color}
              c={10}
              amplitude={index * 10 + 20}
              duration={1}
              startLerp={index / 10}
              endLerp={1 - index / 10}
            />
          );
        })}
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
