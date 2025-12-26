import styled from 'styled-components';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  width: 75%;
  max-width: 900px;
  padding: 36px 44px;
  border: 1px solid #ccc;
  border-radius: 24px;

  background-color: ${(props) => props.backgroundcolor || '#fff'};
  box-shadow: 0 2px 35px rgba(0, 0, 0, 0.1), 0 0px 2px rgba(0, 0, 0, 0.21);
`;

const Card = ({ backgroundcolor, children }) => {
  return (
    <CardContainer backgroundcolor={backgroundcolor}>{children}</CardContainer>
  );
};

export default Card;
