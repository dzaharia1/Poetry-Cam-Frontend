import React from 'react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #eae7e4;
`;

const Logo = styled.img`
  height: 124px;
  width: auto;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    height: 70px;
  }
`;

const Title = styled.h1`
  font-weight: 400;
  letter-spacing: 0.025em;
  margin-bottom: 48px;

  @media (max-width: 768px) {
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
  border: 4px solid #f3f3f3;
  border-top: 4px solid #333;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const SplashScreen = () => {
  return (
    <Container>
      <Logo src="logo.svg" alt="Poetry Cam Logo" />
      <Title>Poetry Cam</Title>
      <Spinner />
    </Container>
  );
};

export default SplashScreen;
