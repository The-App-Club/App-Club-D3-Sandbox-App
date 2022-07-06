import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {css} from '@emotion/css';
import {Spacer} from './components/Spacer';
import {PathTransition} from './components/PathTransition';
import {
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Slider,
} from '@mui/material';

import '@fontsource/inter';
import './styles/index.scss';

const App = () => {
  const [debugProgress, setDebugProgress] = useState(0);

  const handleChangeProgress = (e) => {
    setDebugProgress(e.target.value);
  };

  return (
    <>
      <div
        className={css`
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          margin: 0 auto;
          max-width: 40rem;
          min-height: 100vh;
          padding: 60px;
          @media screen and (max-width: 768px) {
            max-width: 100%;
            padding: 5px;
          }
        `}
      >
        <h2>path morph zoom progress</h2>
        <div
          className={css`
            padding: 60px;
            width: 100%;
          `}
        >
          <Slider
            defaultValue={0}
            min={0}
            max={1}
            step={0.0001}
            value={debugProgress}
            aria-label="Default"
            valueLabelDisplay="auto"
            onChange={handleChangeProgress}
          />
        </div>
        <PathTransition debugProgress={debugProgress} />
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
