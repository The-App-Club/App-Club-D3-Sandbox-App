import {css} from '@emotion/css';

const Spacer = ({height = `3vh`}) => {
  return (
    <div
      className={css`
        width: 100%;
        height: ${height};
      `}
    ></div>
  );
};

export {Spacer};
