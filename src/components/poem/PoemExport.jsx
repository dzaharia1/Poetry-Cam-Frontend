import React, { forwardRef } from 'react';
import styled from 'styled-components';
import ColorCollection from './ColorCollection';
import { useTheme } from '../../contexts/ThemeContext';

const ExportWrapper = styled.div`
  position: absolute;
  left: -9999px;
  top: -9999px;
`;

const InstagramPost = styled.div`
  width: 1080px;
  height: 1080px;
  background-color: ${(props) => props.theme.colors.paper};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  box-sizing: border-box;
  color: ${(props) => props.theme.colors.text.primary};
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
    sans-serif;
  position: relative;
`;

const PoemItelf = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1;
`;

const PoemTitle = styled.h2`
  width: 100%;
  font-size: 64px;
  margin-bottom: 40px;
  font-weight: 800;
  color: ${(props) => props.theme.colors.text.headings};
`;

const PoemExportLine = styled.p`
  width: 100%;
  font-size: 40px;
  line-height: 1.6;
  font-weight: 400;
  max-width: 900px;
  text-indent: -1.5rem;
  padding-left: 1.5rem;
  text-align: left;
  color: ${(props) => props.theme.colors.text.primary};
`;

const DateStamp = styled.p`
  font-size: 32px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;
  text-indent: 0;
  padding-left: 0;
`;

const PoemExportText = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
`;

const FooterLogo = styled.img`
  width: 144px;
  height: 144px;
  margin: 0;
`;

const PoemExport = forwardRef(
  ({ title, text, colors, dayOfWeek, date, month, year, penName }, ref) => {
    const { isDarkMode } = useTheme();
    return (
      <ExportWrapper>
        <InstagramPost ref={ref}>
          <PoemItelf>
            <PoemTitle>{title}</PoemTitle>
            <PoemExportText>
              {text.split('\n').map((line, i) => (
                <PoemExportLine key={i}>{line}</PoemExportLine>
              ))}
            </PoemExportText>
          </PoemItelf>
          <FooterContainer>
            {dayOfWeek && date && month && year && (
              <DateStamp>
                {penName && <span>{penName} • </span>}
                {dayOfWeek}, {month} {date}, {year}
              </DateStamp>
            )}
            <FooterLogo
              src={isDarkMode ? 'logodark.svg' : 'logo.svg'}
              alt="Poetry Cam"
            />
          </FooterContainer>
          <ColorCollection colors={colors} />
        </InstagramPost>
      </ExportWrapper>
    );
  },
);

PoemExport.displayName = 'PoemExport';

export default PoemExport;
