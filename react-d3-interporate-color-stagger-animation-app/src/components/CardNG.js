import {useEffect, useState} from 'react';
import styled from '@emotion/styled';
import {css, cx} from '@emotion/css';
import {useRef} from 'react';
import {keyframes} from '@emotion/react';

const a = keyframes`
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(-100px);
    transform: translateY(-100px);
  }
`;

const StyledCard = styled.div`
  border: 1px solid;
`;

const CardNG = ({
  n,
  src,
  delay,
  duration,
  hide,
  cardWidth = `5rem`,
  cardHeight = `5rem`,
}) => {
  const itemDomRef = useRef(null);
  const boxDomRef = useRef(null);
  const [imageSize, setImageSize] = useState({width: 0, height: 0});

  useEffect(() => {
    const itemDom = itemDomRef.current;
    setImageSize({width: itemDom.offsetWidth, height: itemDom.offsetHeight});
  }, [itemDomRef]);

  return (
    <StyledCard
      ref={itemDomRef}
      className={cx(
        `div${n}`,
        css`
          animation-duration: ${duration};
          animation-delay: ${delay}ms;
          animation-direction: ${hide ? 'normal' : 'reverse'};
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-fill-mode: both;
          animation-name: ${a};
        `
      )}
    >
      <div
        ref={boxDomRef}
        className={css`
          width: ${cardWidth};
          height: ${cardHeight};
        `}
      >
        <img
          src={src}
          alt={''}
          width={imageSize.width}
          height={imageSize.height}
          className={css`
            object-fit: cover;
          `}
        />
      </div>
    </StyledCard>
  );
};

export {CardNG};
