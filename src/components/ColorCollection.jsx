import react from 'react';
import styled from 'styled-components';

const ColorSwatch = styled.div`
  width: 20px;
  flex: 1;

  // border-radius: 50%;
  // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ColorSwatchSet = styled.div`
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  // height: 100%;
`;

const ColorCollection = ({ colors }) => {
  return (
    <>
      <ColorSwatchSet>
        {colors.map((color, index) => (
          <ColorSwatch key={index} style={{ backgroundColor: color }} />
        ))}
      </ColorSwatchSet>
      <ColorSwatchSet placement="right">
        {colors.map((color, index) => (
          <ColorSwatch key={index} style={{ backgroundColor: color }} />
        ))}
      </ColorSwatchSet>
    </>
  );
};

export default ColorCollection;
