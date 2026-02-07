import styled from 'styled-components';

const ColorSwatch = styled.div`
  width: 20px;
  flex: 1;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    height: 20px;
  }

  // border-radius: 50%;
  // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ColorSwatchSet = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  height: 1rem;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  // height: 100%;

  // @media (max-width: 768px) {
  //   right: 0;
  //   left: 0;
  //   top: 0;
  //   bottom: unset;

  //   flex-direction: row;
  // }
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
