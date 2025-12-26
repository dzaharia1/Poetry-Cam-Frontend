import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from './components/Card';
import ColorCollection from './components/ColorCollection';

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #333;
`;

const PoemHeading = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
`;

function App() {
  const [poem, setPoem] = useState('');
  const [colors, setColors] = useState([]);
  const [title, setTitle] = useState('');
  const APIUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3109';

  const getLatestPoem = async () => {
    const url = `${APIUrl}/last-data`;
    console.log('Fetching from:', url);
    try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error(
          'Expected JSON but got:',
          contentType,
          text.substring(0, 100),
        );
        return;
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      if (data) {
        setPoem(data.poem || '');
        setColors(data.palette || []);
        setTitle(data.title || '');
      }
    } catch (error) {
      console.error('Error fetching latest poem:', error);
    }
  };

  useEffect(() => {
    getLatestPoem();
  }, []);

  return (
    <Page>
      <Card backgroundcolor={'#f4f2edff'}>
        <h2>{title}</h2>
        <pre>{poem}</pre>
        <ColorCollection colors={colors} />
      </Card>
    </Page>
  );
}

export default App;
