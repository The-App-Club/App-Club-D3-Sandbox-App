import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {GeoChart} from './components/GeoChart';
// import data from './data/mini-geo.json';
// import data from './data/northern-africa-geo.json'
// import data from './data/southern-africa-geo.json'
// import data from './data/southern-europe-geo.json';
// import data from './data/northern-europe-geo.json';
import data from './data/eastern-asia-geo.json';
import {css} from '@emotion/css';
import {Spacer} from './components/Spacer';
import {FormControl, Select, InputLabel, MenuItem, Slider} from '@mui/material';

import '@fontsource/inter';
import './styles/index.scss';

// console.log(data)

// const a = data2.features.filter((item) => {
//   return item.properties.subregion === 'Eastern Asia';
// });
// console.log(JSON.stringify(a));

const App = () => {
  const [property, setProperty] = useState('pop_est');
  const [debugProgress, setDebugProgress] = useState(0);
  const handleChange = (e) => {
    setProperty(e.target.value);
  };

  const handleChangeProgress = (e) => {
    setDebugProgress(e.target.value);
  };

  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        margin: 0 auto;
        max-width: 40rem;
        padding: 60px;
        @media screen and (max-width: 768px) {
          max-width: 100%;
          padding: 5px;
        }
      `}
    >
      <div
        className={css`
          padding: 20px;
          width: 100%;
        `}
      >
        <p>zoom progress</p>
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
        <p>Select property to highlight</p>
        {[...Array(1).keys()].map((n, index) => {
          return <Spacer key={index} />;
        })}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Property</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={property}
            label="Property"
            onChange={handleChange}
          >
            <MenuItem value={'pop_est'}>Population</MenuItem>
            <MenuItem value={'name_len'}>Name length</MenuItem>
            <MenuItem value={'gdp_md_est'}>GDP</MenuItem>
            <MenuItem value={'continent'}>Continent</MenuItem>
            <MenuItem value={'subregion'}>Subregion</MenuItem>
          </Select>
        </FormControl>
      </div>
      {[...Array(1).keys()].map((n, index) => {
        return <Spacer key={index} />;
      })}
      <GeoChart data={data} property={property} debugProgress={debugProgress} />
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
