import {useState, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {useInterval} from './hooks/useInterval';
import {Button} from '@mui/material';
import {css} from '@emotion/css';
import {Bebop} from './components/Bebop';
import {default as chance} from 'chance';
import '@fontsource/kaushan-script';
import './styles/index.scss';

const rawData = [
  {
    key: 1,
    char: `a`,
    value: chance().integer({min: 10, max: 30}),
  },
  {
    key: 2,
    char: `b`,
    value: chance().integer({min: 10, max: 30}),
  },
  {
    key: 3,
    char: `c`,
    value: chance().integer({min: 10, max: 30}),
  },
];
const charList = 'abcdefghijklmnopqrstuvwxyz'.split('');

const App = () => {
  const domRef = useRef();
  const [iteration, setIteration] = useState(0);
  const [data, setData] = useState(rawData);
  const [start, setStart] = useState(false);
  useInterval(() => {
    if (start) {
      setData((data) => {
        return data.map((d, index) => {
          return {
            ...d,
            value: Math.max(0, d.value + chance().integer({min: -30, max: 30})),
          };
        });
      });
      setIteration(iteration + 1);
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
      <Button
        variant={'outlined'}
        onClick={(e) => {
          const cList = data.map((d, index) => {
            return d.char;
          });
          const remainList = charList.filter((c, i) => {
            return !cList.includes(c);
          });
          const choiceChar =
            remainList[chance().integer({min: 0, max: remainList.length - 1})];
          setData([
            ...data,
            {
              key:
                Math.max(
                  ...data.map((d) => {
                    return d.key;
                  })
                ) + 1,
              char: choiceChar,
              value: chance().integer({min: 10, max: 30}),
            },
          ]);
        }}
      >
        {'add'}
      </Button>
      <Button
        variant={'outlined'}
        onClick={(e) => {
          setData(rawData);
        }}
      >
        {'restore'}
      </Button>
      <Button
        variant={'outlined'}
        onClick={(e) => {
          setData((data) => {
            const choice =
              data[chance().integer({min: 0, max: data.length - 1})];
            return data.filter((d, i) => {
              return d.char !== choice.char;
            });
          });
        }}
      >
        {'remove'}
      </Button>
      <p>round up {iteration}</p>
      <div
        className={css`
          display: grid;
          place-items: center;
          width: 100%;
          min-height: 100vh;
        `}
        ref={domRef}
      >
        <Bebop data={data} />
      </div>
    </>
  );
};
const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
