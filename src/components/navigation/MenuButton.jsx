import React from 'react';
import styled from 'styled-components';
import { PanelLeft } from 'lucide-react';

const MenuButtonItself = styled.button`
  padding: 8px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  border: none;
  color: #333;
  transition: all 0.2s;
  border-radius: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const MenuButton = ({ handleMenuClick }) => {
  return (
    <MenuButtonItself onClick={handleMenuClick} aria-label="Toggle Menu">
      <PanelLeft size={24} />
    </MenuButtonItself>
  );
};

export default MenuButton;
