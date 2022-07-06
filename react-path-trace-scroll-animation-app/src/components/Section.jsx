import {motion, useTransform, transform} from 'framer-motion';
import {forwardRef, useCallback, useMemo, useRef} from 'react';
import {useScrollTrigger} from './ScrollTriggerProvider';
import styled from '@emotion/styled';
import {css} from '@emotion/css';
import * as d3 from 'd3';
import {PathTrace} from './PathTrace';
import waldo from '../assets/waldo-20211001-153331.jpg';

const StyledSection = styled(motion.section)`
  position: relative;
  min-height: 100vh;
  height: 100%;
`;

const Section = ({progress, colorInterpolator}) => {
  return (
    <StyledSection
      className={css`
        /* background: ${colorInterpolator(progress)}; */
        background-image: url(${waldo});
        width: 100%;
      `}
    >
      <div
        className={css`
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        `}
      >
        <PathTrace progress={progress} />
      </div>
    </StyledSection>
  );
};

export {Section};
