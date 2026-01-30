import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Card from './Card';
import ColorCollection from './ColorCollection';
import { MoreVertical, Trash2 } from 'lucide-react';

const PoemHeading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  position: relative;
`;

const PoemTitle = styled.h2`
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 44px;

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 24px;
  }
`;

const PoemMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 36px;
  height: 36px;
  margin-top: 10px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
  min-width: 150px;
  padding: 8px 0;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &.delete {
    color: #ff4d4f;
  }
`;

const PoemText = styled.p`
  font-size: 28px;
  font-weight: 300;
  white-space: pre-wrap;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Poem = ({ title, text, colors, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <Card backgroundcolor={'#f4f2edff'}>
      <PoemHeading ref={menuRef}>
        <PoemTitle>{title}</PoemTitle>
        <PoemMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MoreVertical size={24} />
        </PoemMenuButton>
        {isMenuOpen && (
          <MenuContainer>
            <MenuItem
              className="delete"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this poem?')) {
                  onDelete();
                }
                setIsMenuOpen(false);
              }}>
              <Trash2 size={18} />
              Delete
            </MenuItem>
          </MenuContainer>
        )}
      </PoemHeading>
      <PoemText>{text}</PoemText>
      <ColorCollection colors={colors} />
    </Card>
  );
};

export default Poem;
