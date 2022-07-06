import {useEffect, useState} from 'react';
import styled from '@emotion/styled';
import {css, cx} from '@emotion/css';
import {useRef} from 'react';

const StyledCard = styled.div`
  border: 1px solid;
`;

const Card = ({
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

  useEffect(() => {
    const anim = itemDomRef.current.animate(
      [
        {
          WebkitTransform: 'translateY(0)',
          transform: 'translateY(0)',
          opacity: 0,
        },
        {
          WebkitTransform: 'translateY(-100px)',
          transform: 'translateY(-100px)',
          opacity: 1,
        },
      ],
      {
        duration: duration,
        delay: delay,
        direction: hide ? 'normal' : 'reverse',
        easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        fill: 'both',
      }
    );
    return () => {
      anim.cancel();
    };
  }, [duration, delay, hide]);

  return (
    <StyledCard ref={itemDomRef} className={cx(`div${n}`)}>
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

export {Card};
