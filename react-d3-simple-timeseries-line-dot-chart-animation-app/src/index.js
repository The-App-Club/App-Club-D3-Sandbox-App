import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {css} from '@emotion/css';
import {Cowboy} from './components/Cowboy';
import {useInterval} from './hooks/useInterval';
import {Button} from '@mui/material';
import {default as chance} from 'chance';
import * as R from 'ramda';
import dayjs from 'dayjs';
import './styles/index.scss';

const dataCount = 30;
const minValue = 0;
const maxValue = 100;

const rawData = [...Array(dataCount).keys()].map((n, index) => {
  return {
    name: chance().name(),
    value: chance().integer({
      min: minValue,
      max: maxValue,
    }),
    date: dayjs()
      .add(index - dataCount / 2, 'days')
      .startOf('day')
      .toDate(),
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
            value: R.clamp(
              minValue,
              maxValue,
              d.value + chance().integer({min: -30, max: 30})
            ),
          };
        })
      );
    }
  }, 1000);

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
          flex-direction: column;
          align-items: stretch;
          margin: 0 auto;
          max-width: 70rem;
          min-height: 100vh;
          padding: 0 60px;
          @media screen and (max-width: 768px) {
            max-width: 100vw;
            padding: 0 10px;
          }
        `}
      >
        <Cowboy data={data} maxHeight={300} />
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
