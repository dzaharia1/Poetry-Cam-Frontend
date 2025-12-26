import react from 'react';
import styled from 'styled-components';

const ColorSwatch = styled.div`
  width: 50px;
  height: 50px;

  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ColorSwatchSet = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 10px;

  width: 100%;
`;

const ColorCollection = ({ colors }) => {
  return (
    <ColorSwatchSet>
      {colors.map((color, index) => (
        <ColorSwatch key={index} style={{ backgroundColor: color }} />
      ))}
    </ColorSwatchSet>
  );
};

export default ColorCollection;
