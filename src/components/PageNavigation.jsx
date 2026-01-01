import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';

const PageNavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  width: 75%;
  max-width: 900px;
`;

const NavButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
  color: #333;
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f0f0f0;
  }

  &:disabled {
    color: #aeaeae;
    cursor: not-allowed;
    border-color: #eee;
  }
`;

const PageNavigation = ({ onNext, onPrev, hasNext, hasPrev }) => {
  return (
    <PageNavigationContainer>
      <Button variant="secondary" disabled={!hasPrev} onClick={onPrev}>
        Previous (Older)
      </Button>
      <Button variant="secondary" disabled={!hasNext} onClick={onNext}>
        Next (Newer)
      </Button>
    </PageNavigationContainer>
  );
};

export default PageNavigation;
