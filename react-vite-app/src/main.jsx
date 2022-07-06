import {useState} from 'react';
import ReactDOMClient from 'react-dom/client';
import './styles/index.scss';
import {Button} from '@mui/material';
import {Cowboy} from './components/Cowboy';
import {css} from '@emotion/css';
import {default as chance} from 'chance';

const generateData = () => {
  return [...Array(15).keys()].map((n, i) => {
    let r = chance().integer({min: -2, max: 2});
    if (r === 0) {
      r = (i % 2 === 0 ? -1 : 1) / 2;
    }
    return r * Math.PI;
  });
};

const rawData = generateData();

const App = () => {
  const [data, setData] = useState(rawData);

  const updateData = () => {
    setData(generateData());
  };

  return (
    <>
      <Button variant="outlined" onClick={updateData}>
        {'Update'}
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
        <Cowboy data={data} />
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = ReactDOMClient.createRoot(container);

root.render(<App />);
