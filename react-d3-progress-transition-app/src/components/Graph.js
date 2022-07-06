import {css} from '@emotion/css';
import {Path} from './Path';
import {useState} from 'react';
import {Slider} from '@mui/material';

const Graph = ({color, progress, dataFilePath}) => {
  const [debugProgress, setDebugProgress] = useState(0);

  const handleChange = (e) => {
    setDebugProgress(e.target.value);
  };

  return (
    <>
      <div
        className={css`
          max-width: 300px;
          padding: 3rem;
        `}
      >
        <Slider
          defaultValue={0}
          value={debugProgress}
          aria-label="Default"
          valueLabelDisplay="auto"
          onChange={handleChange}
        />
      </div>
      <div
        className={css`
          display: grid;
          place-items: center;
          min-height: 100vh;
        `}
      >
        <div
          className={css`
            display: flex;
            align-items: flex-end;
            gap: 3rem;
          `}
        >
          <Path
            color={color}
            progress={progress}
            debugProgress={debugProgress}
            dataFilePath={dataFilePath}
          />
        </div>
      </div>
    </>
  );
};

export {Graph};
