import react from 'react';
import styled from 'styled-components';

const MenuButtonItself = styled.button`
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

const MenuButton = ({ handleMenuClick }) => {
  return <MenuButtonItself onClick={handleMenuClick}>Menu</MenuButtonItself>;
};

export default MenuButton;
