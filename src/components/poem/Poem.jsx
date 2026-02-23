import React, { useState, useRef, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import Card from '../basecomponents/Card';
import ColorCollection from './ColorCollection';
import { MoreVertical, Trash2, Download, Star, RefreshCw } from 'lucide-react';
import { toPng } from 'html-to-image';
import IconButton from '../basecomponents/IconButton';
import Tabs from '../basecomponents/Tabs';
import PoemExport from './PoemExport';

const PoemHeading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  position: relative;
  margin-bottom: ${(props) => props.theme.spacing[5]};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin-bottom: ${(props) => props.theme.spacing[4]};
  }
`;

const PoemTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.size.h2};
  font-weight: bold;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.typography.size.h2Mobile};
  }
`;

const PoemControlsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin-top: 2px;
  }
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: ${(props) => props.theme.colors.paper};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: ${(props) => props.theme.colors.shadows.card};
  z-index: 100;
  overflow: hidden;
  min-width: 150px;
  padding: 8px 0;
  transition: all 0.3s ease;
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
  color: ${(props) => props.theme.colors.text.primary};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondaryHover};
  }

  &.delete {
    color: ${(props) => props.theme.colors.text.delete};
  }
`;

const PoemText = styled.div`
  width: 100%;
  flex: 1;
`;

const SketchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  flex: 1;
  overflow: hidden;
  border-radius: 8px;

  &::after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    pointer-events: none;
    border-radius: 0px;
    box-shadow: inset 0 0 20px 40px ${(props) => props.theme.colors.secondary};
  }
`;

const SketchImage = styled.img`
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  object-fit: contain;
  border: 4px solid ${(props) => props.theme.colors.secondary};
`;

const LoadingText = styled.p`
  color: ${(props) => props.theme.colors.text.secondary};
  font-style: italic;
`;

const PoemLine = styled.p`
  font-size: ${(props) => props.theme.typography.size.poemLine};
  font-weight: 300;
  text-indent: -1rem;
  padding-left: 1rem;
  margin: 0;
  line-height: 1.4;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.typography.size.poemLineMobile};
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
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;

  @media (max-width: 800px) {
    font-size: 12px;
  }
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
  isFavorite = false,
  onToggleFavorite,
  penName,
  id,
  sketchUrl,
  isGeneratingSketch,
  onGenerateSketch,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Poem');
  const menuRef = useRef(null);
  const exportRef = useRef(null);
  const isNavigatingRef = useRef(false);

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

  useEffect(() => {
    isNavigatingRef.current = true;
    setActiveTab('Poem');
  }, [id]);

  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      return;
    }
    if (
      activeTab === 'Sketch' &&
      !sketchUrl &&
      !isGeneratingSketch &&
      onGenerateSketch &&
      id
    ) {
      onGenerateSketch(id, title, text);
    }
  }, [
    activeTab,
    sketchUrl,
    isGeneratingSketch,
    onGenerateSketch,
    id,
    title,
    text,
  ]);

  const theme = useTheme();

  return (
    <>
      <Tabs
        tabs={[
          { id: 'Poem', label: 'Poem' },
          { id: 'Sketch', label: 'Sketch' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <Card backgroundcolor={theme.colors.secondary} marginBottom="4rem">
        <PoemHeading ref={menuRef}>
          <PoemTitle>{title}</PoemTitle>
          <PoemControlsContainer>
            <IconButton
              data-testid="favorite-button"
              icon={Star}
              active={isFavorite}
              onClick={() => onToggleFavorite && onToggleFavorite()}
            />
            <IconButton
              data-testid="menu-button"
              icon={MoreVertical}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              active={isMenuOpen}
            />
          </PoemControlsContainer>
          {isMenuOpen && (
            <MenuContainer>
              <MenuItem onClick={handleDownload}>
                <Download size={18} />
                Download
              </MenuItem>
              {activeTab === 'Sketch' && sketchUrl && (
                <MenuItem
                  onClick={() => {
                    if (onGenerateSketch) {
                      onGenerateSketch(id, title, text);
                    }
                    setIsMenuOpen(false);
                  }}>
                  <RefreshCw size={18} />
                  Regenerate Sketch
                </MenuItem>
              )}
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
        {activeTab === 'Poem' && (
          <PoemText>
            {text.split('\n').map((line, i) => (
              <PoemLine key={i}>{line}</PoemLine>
            ))}
          </PoemText>
        )}
        {activeTab === 'Sketch' && (
          <SketchContainer>
            {isGeneratingSketch ? (
              <LoadingText>Imagining a sketch...</LoadingText>
            ) : sketchUrl ? (
              <SketchImage src={sketchUrl} alt={`Sketch for ${title}`} />
            ) : (
              <LoadingText>No sketch available.</LoadingText>
            )}
          </SketchContainer>
        )}
        <FooterContainer>
          {dayOfWeek && date && month && year && (
            <DateStamp>
              {penName && `Captured by ${penName} • `}
              {dayOfWeek}, {month} {date}, {year}
            </DateStamp>
          )}
        </FooterContainer>
        <ColorCollection colors={colors} />

        <PoemExport
          ref={exportRef}
          title={title}
          text={text}
          colors={colors}
          dayOfWeek={dayOfWeek}
          date={date}
          month={month}
          year={year}
          penName={penName}
        />
      </Card>
    </>
  );
};

export default Poem;
