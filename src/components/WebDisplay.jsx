import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getBackendUrl } from '../utils/api';
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
  align-items: flex-start;
  width: 85%;
  height: 100vh;
  padding: 1.5rem 0;
`;

const PoemItelf = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;

  width: 100%;

  padding-bottom: ${(props) => props.theme.spacing[3]};
`;

const PoemHeading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  position: relative;
  margin-bottom: ${(props) => props.theme.spacing[1]};
`;

const PoemTitle = styled.h2`
  font-size: 36px;
  font-weight: bold;
`;

const PoemText = styled.div`
  width: 100%;
`;

const PoemLine = styled.p`
  font-size: 24px;
  font-weight: 300;
  text-indent: -1rem;
  padding-left: 1rem;
  margin: 0;
  line-height: 1.4;
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

const Logo = styled.img`
  position: absolute;
  bottom: 24px;
  right: 36px;
  width: auto;
  height: 28px;
  margin: 0;
`;

const Poem = ({ title, text, dayOfWeek, date, month, year, penName }) => {
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
        <FooterContainer>
          {dayOfWeek && date && month && year && (
            <DateStamp>
              {penName && `Captured by ${penName} • `}
              {dayOfWeek}, {month} {date}, {year}
            </DateStamp>
          )}
        </FooterContainer>
      </PoemItelf>
      <Logo src="/wordmark.svg" alt="Poetry Cam Logo" />
    </>
  );
};

const WebDisplay = () => {
  const { userId } = useParams();
  const [poemData, setPoemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest favorited poem
        const url = getBackendUrl('/public/getPoem', {
          userid: userId,
          index: 0,
          sortByDate: 'true',
          favoritesOnly: 'true',
        });
        const poemRes = await fetch(url);

        if (!poemRes.ok) throw new Error('Failed to fetch poem');
        const poemDataJson = await poemRes.json();

        if (poemDataJson.currentPoem) {
          setPoemData(poemDataJson.currentPoem);
        } else {
          setError('No favorited poems found for this user.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load poem.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
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
          penName={poemData.penName || ''}
        />
      </ContentContainer>
    </Page>
  );
};

export default WebDisplay;
