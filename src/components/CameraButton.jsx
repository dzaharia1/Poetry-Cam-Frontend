import React, { useRef } from 'react';
import styled from 'styled-components';
import { Aperture } from 'lucide-react';

const StyledCameraButton = styled.button`
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
      6px 0px 0px ${(props) => props.theme.colors.shadows.green},
      -6px 0px 0px ${(props) => props.theme.colors.shadows.red};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    box-shadow:
      6px 0px 0px ${(props) => props.theme.colors.shadows.green},
      -6px 0px 0px ${(props) => props.theme.colors.shadows.red};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const CameraButton = ({ onCapture }) => {
  const fileInputRef = useRef(null);

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
    <>
      <StyledCameraButton onClick={handleCameraClick} aria-label="Take Photo">
        <Aperture size={32} />
      </StyledCameraButton>
      <HiddenInput
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </>
  );
};

export default CameraButton;
