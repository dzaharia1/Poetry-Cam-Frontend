import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 75%;
  max-width: 900px;
  margin-bottom: 50px;
`;

const TopIcon = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 30px;

  width: 80px;
  height: 80px;
  background-color: #f4f2edff;

  border: 3px solid #ddb999ff;
  border-radius: 25%;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const TopBar = ({ onLogout }) => {
  return (
    <Container>
      <LogoContainer>
        <TopIcon>8=&gt;</TopIcon>
        <h2> Poetry Cam </h2>
      </LogoContainer>
      {onLogout && (
        <Button variant="secondary" onClick={onLogout}>
          Log out
        </Button>
      )}
    </Container>
  );
};

export default TopBar;
