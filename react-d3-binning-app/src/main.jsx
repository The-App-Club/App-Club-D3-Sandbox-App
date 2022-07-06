import {createRoot} from 'react-dom/client';
import {css} from '@emotion/css';
import * as d3 from 'd3';
import '@fontsource/inter';
import './styles/index.scss';
import {range} from 'range';
import {tidy, groupBy} from '@tidyjs/tidy';
import {Graph} from './components/Graph';
import {Custom} from './components/Custom';
import {Spacer} from './components/Spacer';
import {Button, Slider} from '@mui/material';
import {useState} from 'react';
import {default as chance} from 'chance';
// const data = [
//   73.4, 69.3, 64.9, 75.6, 74.9, 80.3, 78.6, 84.1, 88.9, 90.3, 83.4, 69.3,
//   52.4, 58.3, 67.4, 74.0, 89.3, 63.4,
// ];

const data = [...Array(40).keys()].map((n, index) => {
  return chance().integer({min: 0, max: 300});
});

const createBin = (min, max, binSize) => {
  const bins = [];
  const step = (max - min) / binSize;
  const list = range(min, max, Math.ceil(step));
  list.push(max);
  return d3.pairs(list);
};

const getDomain = (data) => {
  // https://github.com/uber/react-vis/blob/premodern/showcase/misc/voronoi-line-chart.js#L41-L50
  const {min, max} = data.reduce(
    (acc, row) => ({
      min: Math.min(acc.min, row),
      max: Math.max(acc.max, row),
    }),
    {min: Infinity, max: -Infinity}
  );
  return [min, max];
};
const matchBinIndex = (value, array = []) => {
  return array.findIndex((item) => {
    return item[0] <= value && value <= item[1];
  });
};
const roundUp = (num, precision) => {
  // https://stackoverflow.com/a/5191133/15972569
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
};
const niceBinning = ({data, bins}) => {
  const tmp = [];
  let unmatchBins = [];
  data.forEach((d, i) => {
    const result = matchBinIndex(d, bins);
    if (unmatchBins.length === 0) {
      unmatchBins = bins.filter((bin) => {
        return bin[0] !== bins[result][0] && bin[1] !== bins[result][1];
      });
    } else {
      unmatchBins = unmatchBins.filter((bin) => {
        return bin[0] !== bins[result][0] && bin[1] !== bins[result][1];
      });
    }
    tmp.push({data: d, grp: bins[result]});
  });
  unmatchBins.forEach((unmatchBin) => {
    tmp.push({data: null, grp: unmatchBin});
  });
  const result = tidy(
    tmp,
    groupBy(
      ['grp'],
      groupBy.object() // <-- specify the export
    )
  );
  const cool = [];
  Object.entries(result).forEach((d) => {
    const bins = d[0].split(',');
    const result = d[1].reduce((a, c) => {
      c.data && a.push(c.data);
      return a;
    }, []);
    result['x0'] = Number(bins[0]);
    result['x1'] = Number(bins[1]);
    cool.push(result);
  });
  return cool;
};
const App = () => {
  const [binSize, setBinSize] = useState(4);
  const handleBinSize = (e) => {
    const bin = Number(e.target.value);
    setBinSize(bin);
  };
  const quantity = 10;
  const minmax = getDomain(data);
  const min = roundUp(minmax[0], -1) - quantity;
  const max = roundUp(minmax[1], -1);
  const bins = createBin(0, max, binSize);
  const myResult = niceBinning({data, bins}).sort((a, b) => {
    return a['x0'] - b['x1'];
  });
  return (
    <>
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
            max-width: 100%;
            padding: 0 5px;
          }
        `}
      >
        <div
          className={css`
            padding: 60px;
          `}
        >
          <Slider
            min={1}
            max={30}
            step={1}
            defaultValue={4}
            aria-label="Default"
            valueLabelDisplay="auto"
            onChange={handleBinSize}
          />
        </div>
        <Graph data={data} binSize={binSize} />
        {[...Array(3).keys()].map((n, index) => {
          return <Spacer key={index} />;
        })}
        <Custom data={data} binSize={binSize} bins={myResult} />
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
