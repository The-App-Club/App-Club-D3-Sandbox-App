import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {css} from '@emotion/css';
import {Cowboy} from './components/Cowboy';
import {useInterval} from './hooks/useInterval';
import {Button} from '@mui/material';
import {default as chance} from 'chance';
import * as R from 'ramda';
import './styles/index.scss';

const dataCount = 30;
const minValue = 0;
const maxValue = 100;

const rawData = [...Array(dataCount).keys()].map((n, index) => {
  return {
    name: chance().name(),
    x: chance().integer({
      min: minValue,
      max: maxValue,
    }),
    y: chance().integer({
      min: minValue,
      max: maxValue,
    }),
  };
});

const App = () => {
  const [data, setData] = useState(rawData);
  const [start, setStart] = useState(false);
  useInterval(() => {
    if (start) {
      setData(
        data.map((d, i) => {
          return {
            ...d,
            x: d.x + chance().integer({min: 0, max: 50}),
            y: d.y + chance().integer({min: 0, max: 50}),
          };
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
        <Cowboy data={data} />
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
