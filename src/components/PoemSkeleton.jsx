import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import Card from './Card';

const pulse = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 0.3; }
  100% { opacity: 0.2; }
`;

const SkeletonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SkeletonBar = styled.div`
  background-color: ${(props) => props.theme.colors.text.secondary};
  height: ${(props) => props.height || '20px'};
  width: ${(props) => props.width || '100%'};
  border-radius: 4px;
  animation: ${pulse} 1.5s ease-in-out infinite;
  margin-bottom: ${(props) => props.marginBottom || '0'};
`;

const PoemHeadingDummy = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${(props) => props.theme.spacing[5]};
  margin-top: ${(props) => props.theme.spacing[2]};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin-bottom: ${(props) => props.theme.spacing[4]};
  }
`;

const PoemTextDummy = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FooterDummy = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

const ColorPaletteDummy = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
  justify-content: center;
`;

const CircleDummy = styled(SkeletonBar)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-bottom: 0;
`;

const PoemSkeleton = () => {
  const theme = useTheme();

  return (
    <Card backgroundcolor={theme.colors.secondary} marginBottom="4rem">
      <SkeletonContainer>
        {/* Title area */}
        <PoemHeadingDummy>
          <SkeletonBar width="60%" height="30px" />
        </PoemHeadingDummy>

        {/* Poem lines - randomized widths for effect */}
        <PoemTextDummy>
          <SkeletonBar width="85%" height="22px" />
          <SkeletonBar width="70%" height="22px" />
          <SkeletonBar width="90%" height="22px" />
          <SkeletonBar width="60%" height="22px" />
          <SkeletonBar width="80%" height="22px" />
        </PoemTextDummy>

        {/* Footer date */}
        <FooterDummy>
          <SkeletonBar width="30%" height="16px" />
        </FooterDummy>
      </SkeletonContainer>
    </Card>
  );
};

export default PoemSkeleton;
