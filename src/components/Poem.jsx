import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Card from './Card';
import ColorCollection from './ColorCollection';
import { MoreVertical, Trash2, Download, Star } from 'lucide-react';
import { toPng } from 'html-to-image';
import IconButton from './IconButton';

const PoemHeading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  position: relative;
  margin-bottom: 44px;

  @media (max-width: 800px) {
    margin-bottom: 24px;
  }
`;

const PoemTitle = styled.h2`
  font-size: 40px;
  font-weight: bold;

  @media (max-width: 800px) {
    font-size: 22px;
  }
`;

const PoemControlsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;

  @media (max-width: 800px) {
    margin-top: 2px;
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

const PoemText = styled.div`
  width: 100%;
`;

const PoemLine = styled.p`
  font-size: 28px;
  font-weight: 300;
  text-indent: -1rem;
  padding-left: 1rem;
  margin: 0;
  line-height: 1.4;

  @media (max-width: 800px) {
    font-size: 18px;
  }
`;

const FooterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  position: relative;
  margin-top: 24px;

  @media (max-width: 800px) {
    margin-top: 16px;
  }
`;

const DateStamp = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin: 0;

  @media (max-width: 800px) {
    font-size: 12px;
  }
`;

const FooterLogo = styled.img`
  width: 56px;
  height: 56px;
  margin: 0;
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
  padding: 100px;
  box-sizing: border-box;
  color: #1a1a1a;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
    sans-serif;
  position: relative;

  h2 {
    width: 100%;
    font-size: 72px;
    margin-bottom: 48px;
    font-weight: 800;
  }

  p {
    width: 100%;
    font-size: 44px;
    line-height: 1.6;
    font-weight: 400;
    max-width: 900px;
    text-indent: -1.5rem;
    padding-left: 1.5rem;
    text-align: left;
  }

  .date-stamp {
    font-size: 32px;
    font-weight: 600;
    color: #666;
    margin-top: 64px;
    margin-bottom: 0;
    text-indent: 0;
    padding-left: 0;
  }
`;

const PoemExportText = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Poem = ({
  title,
  text,
  colors,
  dayOfWeek,
  date,
  month,
  year,
  onDelete,
  webDisplayPlacement = false,
  isFavorite = false,
  onToggleFavorite,
}) => {
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
    <Card
      backgroundcolor={'#f4f2edff'}
      marginBottom={webDisplayPlacement ? '0' : '4rem'}>
      <PoemHeading ref={menuRef}>
        <PoemTitle>{title}</PoemTitle>
        {!webDisplayPlacement && (
          <PoemControlsContainer>
            <IconButton
              icon={Star}
              active={isFavorite}
              onClick={() => onToggleFavorite && onToggleFavorite()}
            />
            <IconButton
              icon={MoreVertical}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              active={isMenuOpen}
            />
          </PoemControlsContainer>
        )}
        {isMenuOpen && (
          <MenuContainer>
            <MenuItem onClick={handleDownload}>
              <Download size={18} />
              Download
            </MenuItem>
            {onDelete && (
              <MenuItem
                className="delete"
                onClick={() => {
                  if (
                    window.confirm('Are you sure you want to delete this poem?')
                  ) {
                    onDelete();
                  }
                  setIsMenuOpen(false);
                }}>
                <Trash2 size={18} />
                Delete
              </MenuItem>
            )}
          </MenuContainer>
        )}
      </PoemHeading>
      <PoemText>
        {text.split('\n').map((line, i) => (
          <PoemLine key={i}>{line}</PoemLine>
        ))}
      </PoemText>
      <FooterContainer>
        {dayOfWeek && date && month && year && (
          <DateStamp>
            {dayOfWeek}, {month} {date}, {year}
          </DateStamp>
        )}
        {webDisplayPlacement && (
          <FooterLogo src="../logo.svg" alt="Poetry Cam Logo" />
        )}
      </FooterContainer>
      {webDisplayPlacement ? null : <ColorCollection colors={colors} />}

      <ExportWrapper>
        <InstagramPost ref={exportRef}>
          <h2>{title}</h2>
          <PoemExportText>
            {text.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </PoemExportText>
          <FooterContainer>
            {dayOfWeek && date && month && year && (
              <p className="date-stamp">
                {dayOfWeek}, {month} {date}, {year}
              </p>
            )}
            {webDisplayPlacement && (
              <FooterLogo src="logo.png" alt="Poetry Cam Logo" />
            )}
          </FooterContainer>
          <ColorCollection colors={colors} />
        </InstagramPost>
      </ExportWrapper>
    </Card>
  );
};

export default Poem;
