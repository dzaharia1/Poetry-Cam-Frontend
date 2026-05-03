import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Aperture, Camera, FolderOpen } from 'lucide-react';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
`;

const StyledMainButton = styled.button`
  position: relative;
  z-index: 2;
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
    ${(props) => (props.$isOpen ? '-6px' : '0px')} 0px 0px
      ${(props) => props.theme.colors.shadows.green},
    ${(props) => (props.$isOpen ? '6px' : '0px')} 0px 0px
      ${(props) => props.theme.colors.shadows.red};
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:active {
    transform: scale(0.95);
  }
`;

const StyledSubButton = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  border: none;
  cursor: pointer;
  z-index: 1;
  opacity: ${(props) => (props.$open ? 1 : 0)};
  pointer-events: ${(props) => (props.$open ? 'auto' : 'none')};
  transform: translateX(${(props) => (props.$open ? props.$offset : 0)}px)
    scale(${(props) => (props.$open ? 1 : 0.4)});
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.2s ease;

  &:active {
    transform: translateX(${(props) => props.$offset}px) scale(0.9);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

// offset = half of main (30) + gap (12) + half of sub (27) = 69px
const SUB_OFFSET = 69;

const CameraButton = ({ onCapture }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [isOpen]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (onCapture) {
        onCapture(e.target.files[0]);
      }
      e.target.value = '';
    }
    setIsOpen(false);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <StyledSubButton
        $open={isOpen}
        $offset={-SUB_OFFSET}
        onClick={() => galleryInputRef.current?.click()}
        aria-label="Browse Photos">
        <FolderOpen size={22} />
      </StyledSubButton>

      <StyledMainButton
        $isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Take Photo">
        <Aperture size={32} />
      </StyledMainButton>

      <StyledSubButton
        $open={isOpen}
        $offset={SUB_OFFSET}
        onClick={() => cameraInputRef.current?.click()}
        aria-label="Open Camera">
        <Camera size={22} />
      </StyledSubButton>

      <HiddenInput
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleFileChange}
      />
      <HiddenInput
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleFileChange}
      />
    </Wrapper>
  );
};

export default CameraButton;
