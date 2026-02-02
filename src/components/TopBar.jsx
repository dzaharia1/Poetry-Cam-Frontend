import React from 'react';
import styled from 'styled-components';
import MenuButton from './navigation/MenuButton';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 80%;
  max-width: 800px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    width: 90%;
    max-width: unset;
  }
`;

const TopIcon = styled.img`
  height: 124px;
  width: auto;

  @media (max-width: 768px) {
    height: 90px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 36px;

  h1 {
    width: 100%;
    font-weight: 400;
    letter-spacing: 0.025em;
  }

  @media (max-width: 768px) {
    gap: 16px;

    h1 {
      font-size: 28px;
    }
  }
`;

const MenuButtonContainer = styled.div`
  @media (min-width: 1120px) {
    display: none;
  }
`;

const TopBar = ({ onLogout, handleMenuClick }) => {
  return (
    <Container>
      <LogoContainer>
        <TopIcon src="logo.svg" />
        <MenuButtonContainer>
          <MenuButton handleMenuClick={handleMenuClick} />
        </MenuButtonContainer>
      </LogoContainer>
    </Container>
  );
};

export default TopBar;
