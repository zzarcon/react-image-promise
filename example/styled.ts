import styled from 'styled-components';
import Image from '../src';

export const AppWrapper = styled.div`
  background: aliceblue;
  border: 1px solid;
  border-radius: 3px;
  padding: 10px;

  img {
    display: block;
  }
`;

export const StyledImage = styled(Image)`
  width: 200px;
`;