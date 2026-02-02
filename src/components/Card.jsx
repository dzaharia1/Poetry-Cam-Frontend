import styled from 'styled-components';

const CardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  width: 80%;
  max-width: 800px;
  padding: 2.25rem 2rem 3rem 2rem;
  border: 1px solid #ccc;
  border-radius: 24px;
  margin-bottom: 2rem;

  background-color: ${(props) => props.backgroundcolor || '#fff'};
  box-shadow: 0 2px 35px rgba(0, 0, 0, 0.1), 0 0px 2px rgba(0, 0, 0, 0.21);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 90%;
    max-width: unset;
    padding: 1.5rem 1.5rem 2.5rem 1.5rem;
  }
`;

const Card = ({ backgroundcolor, children }) => {
  return (
    <CardContainer backgroundcolor={backgroundcolor}>{children}</CardContainer>
  );
};

export default Card;
