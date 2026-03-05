import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import Card from '../basecomponents/Card';
import ColorCollection from './ColorCollection';
import {
  MoreVertical,
  Trash2,
  Download,
  Star,
  Share2,
  RefreshCw,
  Monitor,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import IconButton from '../basecomponents/IconButton';
import Tabs from '../basecomponents/Tabs';
import PoemExport from './PoemExport';

const PoemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: ${(props) => props.theme.spacing[4]};

  width: 100%;
  flex: 1;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex-direction: column-reverse;
  }
`;

const TabContainer = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 0 24px;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 0 48px;
  }
`;

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
  max-height: 500px;
  flex: 1;
  overflow: hidden;
  border-radius: 8px;

  @media (min-width: ${(props) => props.theme.breakpoints.mobile}) {
    max-height: calc(100vh - 420px);
  }

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
    box-shadow: inset 0 0 15px 20px ${(props) => props.theme.colors.secondary};
  }
`;

const SketchImage = styled.img`
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  object-fit: contain;
  border: 4px solid ${(props) => props.theme.colors.secondary};
`;

const LoadingText = styled.p`
  color: ${(props) => props.theme.colors.text.secondary};
  font-style: italic;
`;

const SketchSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const SketchNavigationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  flex: 1;
  gap: 4px;
`;

const SketchNavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: ${(props) => props.theme.colors.text.secondary};
  flex-shrink: 0;
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.secondaryHover};
    color: ${(props) => props.theme.colors.text.primary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const SketchDotsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
`;

const SketchDot = styled.button`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  background: ${(props) =>
    props.$active
      ? props.theme.colors.text.primary
      : props.theme.colors.text.secondary};
  opacity: ${(props) => (props.$active ? 1 : 0.35)};
  transition:
    opacity 0.2s,
    background 0.2s;
  flex-shrink: 0;
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
  sketches = [],
  isGeneratingSketch,
  onGenerateSketch,
  isWebDisplayUser = false,
  onSetWebDisplayPoem,
  webDisplayPoemId,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Poem');
  const [currentSketchIndex, setCurrentSketchIndex] = useState(0);
  const menuRef = useRef(null);
  const exportRef = useRef(null);
  const isNavigatingRef = useRef(false);
  const touchStartX = useRef(null);

  const handleShare = async () => {
    if (!exportRef.current) return;

    try {
      const dataUrl = await toPng(exportRef.current, {
        width: 1080,
        height: 1080,
        cacheBust: true,
      });
      const fileName = `poem-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      const u8arr = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
      const blob = new Blob([u8arr], { type: mime });
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: title });
      } else {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to share poem image', err);
      }
    }
  };

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

  // Default to most recent sketch when poem or sketches change
  useEffect(() => {
    setCurrentSketchIndex(Math.max(0, sketches.length - 1));
  }, [id, sketches]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null || sketches.length <= 1) return;
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(delta) > 40) {
        if (delta > 0) {
          setCurrentSketchIndex((i) => Math.max(0, i - 1));
        } else {
          setCurrentSketchIndex((i) => Math.min(sketches.length - 1, i + 1));
        }
      }
      touchStartX.current = null;
    },
    [sketches.length],
  );

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
  const displayedSketchUrl =
    sketches.length > 0 ? sketches[currentSketchIndex] : sketchUrl;

  return (
    <PoemContainer>
      <TabContainer>
        <Tabs
          tabs={[
            { id: 'Poem', label: 'Poem' },
            { id: 'Sketch', label: 'Sketch' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </TabContainer>
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
              data-testid="share-button"
              icon={Share2}
              onClick={handleShare}
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
              {isWebDisplayUser && id && (
                <MenuItem
                  onClick={() => {
                    onSetWebDisplayPoem && onSetWebDisplayPoem(id);
                    setIsMenuOpen(false);
                  }}>
                  <Monitor size={18} />
                  {id === webDisplayPoemId ? 'Unset web display' : 'Set as web display'}
                </MenuItem>
              )}
              {activeTab === 'Sketch' && sketchUrl && (
                <MenuItem
                  onClick={() => {
                    if (onGenerateSketch) {
                      onGenerateSketch(id, title, text);
                    }
                    setIsMenuOpen(false);
                  }}>
                  <RefreshCw size={18} />
                  Sketch another
                </MenuItem>
              )}
              {onDelete && (
                <MenuItem
                  className="delete"
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to delete this poem?',
                      )
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
          <SketchSection>
            <SketchNavigationWrapper
              onTouchStart={sketches.length > 1 ? handleTouchStart : undefined}
              onTouchEnd={sketches.length > 1 ? handleTouchEnd : undefined}>
              {sketches.length > 1 && (
                <SketchNavButton
                  onClick={() =>
                    setCurrentSketchIndex((i) => Math.max(0, i - 1))
                  }
                  disabled={currentSketchIndex <= 0}
                  aria-label="Previous sketch">
                  <ChevronLeft size={22} />
                </SketchNavButton>
              )}
              <SketchContainer>
                {isGeneratingSketch ? (
                  <LoadingText>Imagining a sketch...</LoadingText>
                ) : displayedSketchUrl ? (
                  <SketchImage
                    src={displayedSketchUrl}
                    alt={`Sketch for ${title}`}
                  />
                ) : (
                  <LoadingText>No sketch available.</LoadingText>
                )}
              </SketchContainer>
              {sketches.length > 1 && (
                <SketchNavButton
                  onClick={() =>
                    setCurrentSketchIndex((i) =>
                      Math.min(sketches.length - 1, i + 1),
                    )
                  }
                  disabled={currentSketchIndex >= sketches.length - 1}
                  aria-label="Next sketch">
                  <ChevronRight size={22} />
                </SketchNavButton>
              )}
            </SketchNavigationWrapper>
            {sketches.length > 1 && (
              <SketchDotsContainer>
                {sketches.map((_, i) => (
                  <SketchDot
                    key={i}
                    $active={i === currentSketchIndex}
                    onClick={() => setCurrentSketchIndex(i)}
                    aria-label={`Sketch ${i + 1}`}
                  />
                ))}
              </SketchDotsContainer>
            )}
          </SketchSection>
        )}
        <FooterContainer>
          {dayOfWeek && date && month && year && (
            <DateStamp>
              {penName && `Drafted for ${penName} • `}
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
    </PoemContainer>
  );
};

export default Poem;
