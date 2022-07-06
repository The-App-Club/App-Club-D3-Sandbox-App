import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import * as d3 from 'd3';
import {RacingBarChart} from './components/RacingBarChart';
import {RacingBarChart2} from './components/RacingBarChart2';
import {useInterval} from './hooks/useInterval';
import {Button} from '@mui/material';
import {css} from '@emotion/css';
import {default as chance} from 'chance';
import {interpolateList} from './plugins/color';
import '@fontsource/kaushan-script';
import './styles/index.scss';

const getRandomIndex = (array) => {
  return chance().integer({min: 0, max: array.length - 1});
};
const dataCount = 10;
const rawData = [...Array(dataCount).keys()].map((n, i) => {
  return {
    name: chance().name(),
    value: chance().integer({min: 10, max: 100}),
    color: d3.schemeTableau10[i],
  };
});

const App = () => {
  const [stack, setStack] = useState(true);
  const [iteration, setIteration] = useState(0);
  const [start, setStart] = useState(false);
  const [data, setData] = useState(rawData);
  const [maxHeight, setMaxHeight] = useState(300);
  useInterval(() => {
    if (start) {
      const randomIndex = getRandomIndex(data);
      setData(
        data.map((d, i) =>
          i === randomIndex
            ? {
                ...d,
                value: Math.max(
                  0,
                  d.value + chance().integer({min: -30, max: 30})
                ),
              }
            : d
        )
      );
      setIteration(iteration + 1);
    }
  }, 500);

  return (
    <>
      <Button
        variant={'outlined'}
        onClick={(e) => {
          setStart((start) => {
            return !start;
          });
        }}
      >
        {start ? 'Stop' : 'Start'}
      </Button>
      <Button
        variant={'outlined'}
        onClick={() => {
          setStack((stack) => {
            return !stack;
          });
        }}
      >
        Change Layout
      </Button>
      <Button
        variant={'outlined'}
        onClick={() => {
          setMaxHeight(
            chance().integer({min: 300, max: window.innerHeight * 0.8})
          );
        }}
      >
        Update Graph Height
      </Button>
      <Button
        variant={'outlined'}
        onClick={() => {
          setData(
            data.map((d) => {
              return {
                name: d.name,
                value: Math.max(
                  0,
                  d.value + chance().integer({min: -30, max: 30})
                ),
                color: d.color,
              };
            })
          );
        }}
      >
        Update data
      </Button>
      <Button
        variant={'outlined'}
        onClick={() => {
          setData(
            data.filter((d) => {
              return d.value > chance().integer({min: 50, max: 100});
            })
          );
        }}
      >
        Filter data
      </Button>
      <Button
        variant={'outlined'}
        onClick={() => {
          setData([
            ...data,
            {
              name: chance().name(),
              value: chance().integer({min: 1, max: 100}),
              color: interpolateList[
                chance().integer({min: 0, max: interpolateList.length})
              ](Math.random()),
            },
          ]);
        }}
      >
        Add data
      </Button>
      <p
        className={css`
          font-size: 3rem;
        `}
      >
        round up: {iteration}
      </p>
      <div
        className={css`
          display: grid;
          place-items: center;
          width: 100%;
          min-height: 100vh;
        `}
      >
        <div
          className={css`
            display: flex;
            justify-content: ${stack ? `center` : `space-around`};
            flex-direction: ${stack ? `column` : `row`};
            align-items: stretch;
            margin: 0 auto;
            max-width: ${stack ? `40rem` : `80rem`};
            padding: 0 60px;
            gap: ${stack ? `3rem` : `10rem`};
            @media screen and (max-width: 768px) {
              max-width: 100vw;
              padding: 0 40px;
            }
          `}
        >
          <RacingBarChart data={data} maxHeight={maxHeight} />
          <RacingBarChart2 data={data} maxHeight={maxHeight} />
        </div>
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
