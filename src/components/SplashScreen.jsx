import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.colors.background};
  transition: background-color 0.3s ease;
`;

const Logo = styled.img`
  height: 124px;
  width: auto;
  margin-bottom: ${(props) => props.theme.spacing[4]};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    height: 70px;
  }
`;

const Title = styled.h1`
  font-weight: 400;
  letter-spacing: 0.025em;
  margin-bottom: ${(props) => props.theme.spacing[4]};
  color: ${(props) => props.theme.colors.text.headings};
  transition: color 0.3s ease;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 28px;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${(props) => props.theme.colors.secondaryHover};
  border-top: 4px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const SplashScreen = () => {
  const { isDarkMode } = useTheme();

  return (
    <Container>
      <Logo
        src={isDarkMode ? 'logodark.svg' : 'logo.svg'}
        alt="Poetry Cam Logo"
      />
      <Title>Poetry Cam</Title>
      <Spinner />
    </Container>
  );
};

export default SplashScreen;
