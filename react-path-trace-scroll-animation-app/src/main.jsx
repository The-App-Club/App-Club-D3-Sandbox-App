import {useId, createRef, useMemo, useState, useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import * as d3 from 'd3';
import '@fontsource/kaushan-script';
import './styles/index.scss';
import {ScrollTriggerProvider} from './components/ScrollTriggerProvider';
import {Section} from './components/Section';

const App = () => {
  const [progress, setProgress] = useState(0);

  const handleChangeProgress = useCallback((e) => {
    setProgress(e);
  }, []);

  return (
    <div className="app">
      <header>Hello</header>
      <main>
        <article>
          <ScrollTriggerProvider
            pcSectionHeight={'300%'}
            spSectionHeight={'600%'}
            handleChangeProgress={handleChangeProgress}
          >
            <Section
              progress={progress}
              colorInterpolator={d3.interpolateBlues}
            />
          </ScrollTriggerProvider>
        </article>
      </main>
      <footer>Bye</footer>
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
