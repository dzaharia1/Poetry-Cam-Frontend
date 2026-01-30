import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const PageNavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  width: 80%;
  max-width: 800px;

  @media (max-width: 768px) {
    width: 90%;
    max-width: unset;
  }
`;

const PageNavigation = ({ onNext, onPrev, hasNext, hasPrev }) => {
  return (
    <PageNavigationContainer>
      <Button
        variant="secondary"
        disabled={!hasNext}
        onClick={onNext}
        startIcon={<ArrowLeft />}>
        Newer
      </Button>
      <Button
        variant="secondary"
        disabled={!hasPrev}
        onClick={onPrev}
        endIcon={<ArrowRight />}>
        Older
      </Button>
    </PageNavigationContainer>
  );
};

export default PageNavigation;
