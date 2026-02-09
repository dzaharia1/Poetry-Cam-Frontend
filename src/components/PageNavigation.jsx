import React from 'react';
import styled from 'styled-components';
import Button from './basecomponents/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import CameraButton from './CameraButton';

const PageNavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  width: 80%;
  max-width: 800px;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 90%;
    max-width: unset;
  }
`;

const CameraButtonContainer = styled.div`
  display: none;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 1;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: flex;
  }
`;

const PageNavigation = ({ onNext, onPrev, hasNext, hasPrev, onCapture }) => {
  return (
    <PageNavigationContainer>
      <Button
        variant="secondary"
        disabled={!hasNext}
        onClick={onNext}
        startIcon={<ArrowLeft />}>
        Previous
      </Button>

      {/* <CameraButtonContainer>
        <CameraButton onCapture={onCapture} />
      </CameraButtonContainer> */}

      <Button
        variant="secondary"
        disabled={!hasPrev}
        onClick={onPrev}
        endIcon={<ArrowRight />}>
        Next
      </Button>
    </PageNavigationContainer>
  );
};

export default PageNavigation;
