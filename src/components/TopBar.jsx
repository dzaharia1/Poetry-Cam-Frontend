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
  height: 80px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
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
        <TopIcon src="wordmark.svg" />
        <MenuButtonContainer>
          <MenuButton handleMenuClick={handleMenuClick} />
        </MenuButtonContainer>
      </LogoContainer>
    </Container>
  );
};

export default TopBar;
