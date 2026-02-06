import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import Card from './Card';
import SplashScreen from './SplashScreen';

const Page = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #fff;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 75%;
  height: 100vh;
  padding: 1.5rem 0;
`;

const PoemItelf = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1;
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

const PoemText = styled.div`
  width: 100%;
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

const FooterLogo = styled.img`
  width: 56px;
  height: 56px;
  margin: 0;
`;

const Poem = ({ title, text, dayOfWeek, date, month, year }) => {
  const theme = useTheme();

  return (
    <>
      <PoemItelf>
        <PoemHeading>
          <PoemTitle>{title}</PoemTitle>
        </PoemHeading>
        <PoemText>
          {text.split('\n').map((line, i) => (
            <PoemLine key={i}>{line}</PoemLine>
          ))}
        </PoemText>
      </PoemItelf>
      <FooterContainer>
        {dayOfWeek && date && month && year && (
          <DateStamp>
            {dayOfWeek}, {month} {date}, {year}
          </DateStamp>
        )}
        <FooterLogo src="/logo.svg" alt="Poetry Cam Logo" />
      </FooterContainer>
    </>
  );
};

const WebDisplay = () => {
  const { userId } = useParams();
  const [poemData, setPoemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPoem = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/getPoem?userid=${userId}&index=0&favoritesOnly=true`,
        );
        if (!res.ok) throw new Error('Failed to fetch poem');
        const data = await res.json();

        if (data.currentPoem) {
          setPoemData(data.currentPoem);
        } else {
          setError('No poems found for this user.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load poem.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPoem();
    } else {
      setError('Invalid User ID');
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <SplashScreen />;
  }

  if (error) {
    return (
      <Page>
        <ContentContainer>
          <p>{error}</p>
        </ContentContainer>
      </Page>
    );
  }

  if (!poemData) return null;

  return (
    <Page>
      <ContentContainer>
        <Poem
          title={poemData.title || ''}
          text={poemData.poem || ''}
          dayOfWeek={poemData.dayOfWeek || ''}
          date={poemData.date || null}
          month={poemData.month || ''}
          year={poemData.year || null}
        />
      </ContentContainer>
    </Page>
  );
};

export default WebDisplay;
