import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Poem from './Poem';
import SplashScreen from './SplashScreen';

const Page = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 900px;
  padding: 2rem;
`;

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
          colors={poemData.palette || []}
          dayOfWeek={poemData.dayOfWeek || ''}
          date={poemData.date || null}
          month={poemData.month || ''}
          year={poemData.year || null}
          webDisplayPlacement={true}
          isFavorite={true}
        />
      </ContentContainer>
    </Page>
  );
};

export default WebDisplay;
