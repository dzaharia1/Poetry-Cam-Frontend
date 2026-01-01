import React from 'react';
import styled from 'styled-components';
import Card from './Card';
import ColorCollection from './ColorCollection';

const PoemHeading = styled.h2`
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 44px;
`;

const PoemText = styled.p`
  font-size: 28px;
  font-weight: 300;
  white-space: pre-wrap;
`;

const Poem = ({ title, text, colors }) => {
  return (
    <Card backgroundcolor={'#f4f2edff'}>
      <PoemHeading>{title}</PoemHeading>
      <PoemText>{text}</PoemText>
      <ColorCollection colors={colors} />
    </Card>
  );
};

export default Poem;
