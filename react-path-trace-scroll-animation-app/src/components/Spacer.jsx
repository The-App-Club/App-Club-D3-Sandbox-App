import styled from '@emotion/styled';

const StyledSpacer = styled.hr`
  border: none;
  width: 100%;
  height: 1rem;
`;

const Spacer = ({height = '1rem'}) => {
  return <StyledSpacer style={{height: height}} />;
};

export {Spacer};
