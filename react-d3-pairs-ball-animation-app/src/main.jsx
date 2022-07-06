import {createRoot} from 'react-dom/client';
import {useEffect, useState} from 'react';
import {useFramerAnimation} from './hooks/useFramerAnimation';
import {css} from '@emotion/css';
import {Object} from './components/Object';
import {schemeTableau10} from 'd3';
import '@fontsource/inter';
import './styles/index.scss';

const width = 500;
const height = 500;
const duration = 3;
const colors = schemeTableau10;

const App = () => {
  const [progress, setProgress] = useState(0);
  useFramerAnimation(duration, (t) => {
    setProgress(t);
  });
  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      `}
    >
      <div
        className={css`
          position: relative;
          border: 1px solid;
          width: ${width}px;
          height: ${height}px;
        `}
      >
        <Object
          startPoint={[30, 30]}
          size={50}
          step={10}
          progress={progress}
          width={width}
          height={height}
          color={colors[0]}
        />
        <Object
          startPoint={[30, 30]}
          size={50}
          step={5}
          progress={progress}
          width={width}
          height={height}
          color={colors[1]}
        />
        <Object
          startPoint={[30, 30]}
          size={50}
          step={25}
          progress={progress}
          width={width}
          height={height}
          color={colors[2]}
        />
        <Object
          startPoint={[30, 30]}
          size={50}
          step={15}
          progress={progress}
          width={width}
          height={height}
          color={colors[3]}
        />
        <Object
          startPoint={[30, 30]}
          size={50}
          step={7}
          progress={progress}
          width={width}
          height={height}
          color={colors[4]}
        />
      </div>
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
