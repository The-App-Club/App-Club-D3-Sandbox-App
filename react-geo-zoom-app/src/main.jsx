import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {GeoChart} from './components/GeoChart';
import data from './data/GeoChart.world.geo.json';
import {css} from '@emotion/css';
import {Spacer} from './components/Spacer';
import {FormControl, Select, InputLabel, MenuItem} from '@mui/material';

import '@fontsource/inter';
import './styles/index.scss';

const App = () => {
  const [property, setProperty] = useState('pop_est');
  const handleChange = (e) => {
    setProperty(e.target.value);
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
        min-height: 100vh;
        padding: 60px;
        @media screen and (max-width: 768px) {
          max-width: 100%;
          padding: 5px;
        }
      `}
    >
      <h2>Select property to highlight</h2>
      {[...Array(1).keys()].map((n, index) => {
        return <Spacer key={index} />;
      })}
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={property}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={'pop_est'}>Population</MenuItem>
          <MenuItem value={'name_len'}>Name length</MenuItem>
          <MenuItem value={'gdp_md_est'}>GDP</MenuItem>
        </Select>
      </FormControl>
      {[...Array(3).keys()].map((n, index) => {
        return <Spacer key={index} />;
      })}
      <h2>World Map with d3-geo</h2>
      {[...Array(1).keys()].map((n, index) => {
        return <Spacer key={index} />;
      })}
      <GeoChart data={data} property={property} />
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
