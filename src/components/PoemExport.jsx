import React, { forwardRef } from 'react';
import styled from 'styled-components';
import ColorCollection from './ColorCollection';

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



const PoemExport = forwardRef(({
  title,
  text,
  colors,
  dayOfWeek,
  date,
  month,
  year,
}, ref) => {
  return (
    <ExportWrapper>
      <InstagramPost ref={ref}>
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
        </FooterContainer>
        <ColorCollection colors={colors} />
      </InstagramPost>
    </ExportWrapper>
  );
});

PoemExport.displayName = 'PoemExport';

export default PoemExport;
