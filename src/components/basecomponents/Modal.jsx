import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import Card from './Card';
import IconButton from './IconButton';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
`;

const StyledModalCard = styled(Card)`
  width: 80%;
  max-width: 600px;
  max-height: 90vh;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    6px 0px 2px ${(props) => props.theme.colors.shadows.green},
    -6px 0px 2px ${(props) => props.theme.colors.shadows.red} !important;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 90%;
    padding: 0 !important;
    max-width: 600px; // Keep it capped
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 1.25rem 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-family: ${(props) => props.theme.typography.fontFamily.heading};
  font-size: ${(props) => props.theme.typography.size.h2Mobile};
  color: ${(props) => props.theme.colors.text.headings};
  text-align: left;
`;

const ModalContent = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 1.5rem;
  }
`;

/**
 * Modal component for displaying content in a centered card over a scrim.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback function to close the modal
 * @param {string} props.title - Title displayed in the modal header
 * @param {React.ReactNode} props.children - Content to be displayed inside the modal
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  // Prevent scrolling on body when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <StyledModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <IconButton icon={X} onClick={onClose} size={20} />
        </ModalHeader>
        <ModalContent>{children}</ModalContent>
      </StyledModalCard>
    </ModalOverlay>
  );
};

export default Modal;
