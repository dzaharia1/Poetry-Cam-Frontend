import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';

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

const CameraButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  border: none;
  cursor: pointer;
  box-shadow:
    0px 0px 0px ${(props) => props.theme.colors.shadows.green},
    0px 0px 0px ${(props) => props.theme.colors.shadows.red};
  transition:
    transform 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;
  z-index: 10; /* Ensure it's clickable */

  &:hover {
    transform: scale(1.03);
    box-shadow:
      6px 0px 2px ${(props) => props.theme.colors.shadows.green},
      -6px 0px 2px ${(props) => props.theme.colors.shadows.red};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    box-shadow:
      6px 0px 2px ${(props) => props.theme.colors.shadows.green},
      -6px 0px 2px ${(props) => props.theme.colors.shadows.red};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PageNavigation = ({ onNext, onPrev, hasNext, hasPrev, onCapture }) => {
  const fileInputRef = React.useRef(null);

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (onCapture) {
        onCapture(e.target.files[0]);
      }
      // Reset input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  return (
    <PageNavigationContainer>
      <Button
        variant="secondary"
        disabled={!hasNext}
        onClick={onNext}
        startIcon={<ArrowLeft />}>
        Previous
      </Button>

      <CameraButton onClick={handleCameraClick} aria-label="Take Photo">
        <Eye size={32} />
      </CameraButton>
      <HiddenInput
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

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
