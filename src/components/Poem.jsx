import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Card from './Card';
import ColorCollection from './ColorCollection';
import { MoreVertical, Trash2, Download } from 'lucide-react';
import { toPng } from 'html-to-image';

const PoemHeading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  position: relative;
  margin-bottom: 44px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const PoemTitle = styled.h2`
  font-size: 40px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 28px;
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

  @media (max-width: 768px) {
    margin-top: 4px;
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
    font-size: 18px;
  }
`;

const ExportWrapper = styled.div`
  position: absolute;
  left: -9999px;
  top: -9999px;
`;

const InstagramPost = styled.div`
  width: 1080px;
  height: 1080px;
  background-color: #f4f2ed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px;
  box-sizing: border-box;
  color: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    pointer-events: none;
  }

  h2 {
    width: 100%;
    font-size: 72px;
    margin-bottom: 48px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  p {
    width: 100%;
    font-size: 44px;
    line-height: 1.6;
    white-space: pre-wrap;
    margin-bottom: 60px;
    font-weight: 400;
    max-width: 900px;
  }
`;

const Poem = ({ title, text, colors, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const exportRef = useRef(null);

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setIsMenuOpen(false);

    try {
      const dataUrl = await toPng(exportRef.current, {
        width: 1080,
        height: 1080,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `poem-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download poem image', err);
    }
  };

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
              onClick={handleDownload}>
              <Download size={18} />
              Download
            </MenuItem>
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

      <ExportWrapper>
        <InstagramPost ref={exportRef}>
          <h2>{title}</h2>
          <p>{text}</p>
          <ColorCollection colors={colors} />
        </InstagramPost>
      </ExportWrapper>
    </Card>
  );
};

export default Poem;
