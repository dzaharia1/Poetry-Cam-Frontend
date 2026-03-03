import React from 'react';
import styled from 'styled-components';
import IconButton from './basecomponents/IconButton';
import CameraButton from './CameraButton';
import { PanelLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 80%;
  max-width: 800px;
  // margin-bottom: 50px;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 90%;
    max-width: unset;
  }
`;

const TopIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  // width: 124px;
  height: 80px;
`;

const TopIcon = styled.img`
  height: 124px;
  width: auto;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    height: 60px;
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

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    gap: 16px;

    h1 {
      font-size: 28px;
    }
  }
`;

const MenuButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: none;
    .mobile-menu {
      display: none;
    }
  }
`;

const CameraButtonContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const TopBar = ({ handleMenuClick, onCapture }) => {
  const { isDarkMode } = useTheme();

  return (
    <Container>
      <LogoContainer>
        <TopIconContainer>
          <TopIcon src={isDarkMode ? 'logodark.svg' : 'logo.svg'} />
        </TopIconContainer>
        <CameraButtonContainer>
          <CameraButton onCapture={onCapture} />
        </CameraButtonContainer>
        <MenuButtonContainer>
          <IconButton
            className="mobile-menu"
            icon={PanelLeft}
            onClick={handleMenuClick}
          />
        </MenuButtonContainer>
      </LogoContainer>
    </Container>
  );
};

export default TopBar;
