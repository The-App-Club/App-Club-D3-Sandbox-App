import {createRoot} from 'react-dom/client';
import * as d3 from 'd3';
import {Scene} from './components/Scene';

import './styles/index.scss';

const App = () => {
  return (
    <>
      <Scene
        color={d3.interpolateBlues}
        pcSectionHeight={`100%`}
        spSectionHeight={`200%`}
        dataFilePath={`/data/sample.json`}
      />
      <Scene
        color={d3.interpolateGreens}
        pcSectionHeight={`100%`}
        spSectionHeight={`200%`}
        dataFilePath={`/data/sample2.json`}
      />
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
