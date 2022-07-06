import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {css} from '@emotion/css';
import {Cowboy} from './components/Cowboy';
import {useInterval} from './hooks/useInterval';
import {Button} from '@mui/material';
import {default as chance} from 'chance';
import * as R from 'ramda';
import './styles/index.scss';

const groupCount = 2;
const dataCount = 30;
const minValue = 0;
const maxValue = 100;
const step = maxValue / groupCount;

const getRandomIndex = (array) => {
  return chance().integer({min: minValue, max: array.length - 1});
};

const mod = (n, m) => {
  return ((n % m) + m) % m;
};

const niceBebop = () => {
  return [...Array(dataCount).keys()].reduce(
    (a, c, i, d) => {
      a.group = mod(i, groupCount) + 1;
      const data = [
        ...a.data,
        {
          group: a.group,
          name: chance().name(),
          x: chance().integer({
            min: step * Math.max(0, a.group - 1),
            max: step * a.group,
          }),
          y: chance().integer({
            min: step * Math.max(0, a.group - 1),
            max: step * a.group,
          }),
          groupMin: step * Math.max(0, a.group - 1),
          groupMax: step * a.group,
        },
      ];
      return {data, group: a.group};
    },
    {group: 0, data: []}
  );
};

const rawData = niceBebop();

console.log(rawData);

const App = () => {
  const [data, setData] = useState(rawData.data);
  const [start, setStart] = useState(false);
  useInterval(() => {
    if (start) {
      const randomIndex = getRandomIndex(data);
      setData(
        data.map((d, i) => {
          if (i !== randomIndex) {
            return {
              ...d,
              x: R.clamp(
                d.groupMin,
                d.groupMax,
                d.x + chance().integer({min: -10, max: 10})
              ),
              y: R.clamp(
                d.groupMin,
                d.groupMax,
                d.y + chance().integer({min: -10, max: 10})
              ),
            };
          } else {
            return d;
          }
        })
      );
    }
  }, 1000);
  // return null;
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
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        `}
      >
        <Cowboy data={data} minValue={minValue} maxValue={maxValue} />
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
