import {createRoot} from 'react-dom/client';
import {useState} from 'react';
import {Button} from '@mui/material';
import {css} from '@emotion/css';
import {BarChart} from './components/BarChart';
import {default as chance} from 'chance';
import './styles/index.scss';

const rawData = [
  {x: 0, y: 0},
  {x: 1, y: 1},
  {x: 2, y: 4},
  {x: 3, y: 9},
  {x: 4, y: 16},
  {x: 5, y: 25},
  {x: 6, y: 36},
  {x: 7, y: 49},
  {x: 8, y: 64},
  {x: 9, y: 81},
  {x: 10, y: 100},
];

const App = () => {
  const [data, setData] = useState(rawData);
  const [maxHeight, setMaxHeight] = useState(300);
  return (
    <>
      <Button
        variant={'outlined'}
        onClick={() => {
          setMaxHeight(chance().integer({min: 300, max: 500}));
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
                x: d.x,
                y: chance().integer({min: 10, max: 300}),
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
              return d.y > chance().integer({min: 100, max: 300});
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
              x:
                Math.max(
                  ...data.map((d) => {
                    return d.x;
                  })
                ) + 1,
              y: chance().integer({min: 10, max: 300}),
            },
          ]);
        }}
      >
        Add data
      </Button>
      <div
        className={css`
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: stretch;
          margin: 0 auto;
          max-width: 40rem;
          min-height: 100vh;
          padding: 0 60px;
          @media screen and (max-width: 768px) {
            max-width: 100vw;
            padding: 0 40px;
          }
        `}
      >
        <BarChart data={data} maxHeight={maxHeight} />
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
