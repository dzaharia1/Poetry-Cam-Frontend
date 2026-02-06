import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Poem from './Poem';
import TopBar from './TopBar';
import PageNavigation from './PageNavigation';
import NavBar from './navigation/NavBar';
import Button from './Button';
import SplashScreen from './SplashScreen';
import Auth from './Auth';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';

const Page = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  // padding: 0 0 2rem 0;
  width: 100%;
  height: 100vh;
`;

const PrimaryPageContents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  width: 75%;
  // max-width: 900px;

  padding: 2rem 0 3rem 0;

  font-size: ${(props) => props.theme.typography.size.body};
  color: ${(props) => props.theme.colors.text.primary};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 1rem 0 1rem 0;
  }
`;

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPoem, setCurrentPoem] = useState('');
  /* Pagination State */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextPoem, setNextPoem] = useState(null); // Newer
  const [previousPoem, setPreviousPoem] = useState(null); // Older
  const [colors, setColors] = useState([]);
  const [title, setTitle] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [date, setDate] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasUnreadPoem, setHasUnreadPoem] = useState(false);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPoemId, setCurrentPoemId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    const fetchPoems = async () => {
      if (!user) return;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/poemList?userid=${user.uid}`,
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setPoems(data);
        }
      } catch (error) {
        console.error('Error fetching poems:', error);
      }
    };
    fetchPoems();
  }, [user, refreshTrigger]);

  // Sync currentIndex if the current poem's position in the list changes (e.g., when favorited)
  useEffect(() => {
    if (currentPoemId && poems.length > 0) {
      const newIndex = poems.findIndex((p) => p.id === currentPoemId);
      if (newIndex !== -1 && newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  }, [poems, currentPoemId, currentIndex]);

  useEffect(() => {
    const startTime = Date.now();
    const minLoadTime = 1000; // 1 second minimum

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    });

    return () => unsubscribe();
  }, []);

  // Helper to fetch poem data from backend
  const fetchPoem = useCallback(
    async (index) => {
      if (!user) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/getPoem?userid=${user.uid}&index=${index}`,
        );
        if (!res.ok) throw new Error('Failed to fetch poem');
        const data = await res.json();

        // Update current poem if it exists in the API response
        if (data.currentPoem) {
          setCurrentPoem(data.currentPoem.poem || '');
          setColors(data.currentPoem.palette || []);
          setTitle(data.currentPoem.title || '');
          setDayOfWeek(data.currentPoem.dayOfWeek || '');
          setDate(data.currentPoem.date || null);
          setMonth(data.currentPoem.month || '');
          setYear(data.currentPoem.year || null);
          setIsFavorite(data.currentPoem.isFavorite || false);
          setCurrentPoemId(data.currentPoem.id || null);
          if (data.currentPoem.index !== undefined) {
            setCurrentIndex(data.currentPoem.index);
          }
        } else {
          if (index === 0) {
            setCurrentPoem(
              'No poems yet. Get out there with your poetry cam and capture one!',
            );
            setTitle('Welcome');
            setColors([]);
            setDayOfWeek('');
            setDate(null);
            setMonth('');
            setYear(null);
            setIsFavorite(false);
            setCurrentPoemId(null);
          }
        }

        // Update neighbors
        setNextPoem(data.nextPoem);
        setPreviousPoem(data.previousPoem);
      } catch (err) {
        console.error('Error fetching poem:', err);
        setError(
          'Failed to fetch poem. This is likely while the Firestore index is building.',
        );
      }
    },
    [user],
  );

  // Initial fetch on load
  useEffect(() => {
    if (user && currentIndex === 0) {
      fetchPoem(0);
    }
  }, [user, fetchPoem]);

  // Sync with Firestore for latest poem (Index 0) to detect new poems
  const isInitialLoad = useRef(true);
  useEffect(() => {
    if (!user) return;
    isInitialLoad.current = true;

    const q = query(
      collection(db, 'poems'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(1),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          if (isInitialLoad.current) {
            isInitialLoad.current = false;
          } else {
            // A new poem has arrived!
            setHasUnreadPoem(true);

            // If we are viewing the latest poem (index 0), update with real-time data from API
            if (currentIndex === 0) {
              fetchPoem(0);
            }
            // Trigger navbar refresh
            setRefreshTrigger((prev) => prev + 1);
          }
        }
      },
      (err) => {
        console.error('Error fetching poems:', err);
        if (err.code === 'failed-precondition') {
          setError(
            'Firestore index might be building or missing. Check console.',
          );
        }
      },
    );

    return () => unsubscribe();
  }, [user, currentIndex, fetchPoem]);

  const handleNext = () => {
    // Going to Newer (lower index)
    if (nextPoem && nextPoem.index !== undefined) {
      setCurrentPoem(nextPoem.poem || '');
      setColors(nextPoem.palette || []);
      setTitle(nextPoem.title || '');
      setDayOfWeek(nextPoem.dayOfWeek || '');
      setDate(nextPoem.date || null);
      setMonth(nextPoem.month || '');
      setYear(nextPoem.year || null);
      setIsFavorite(nextPoem.isFavorite || false);
      setCurrentPoemId(nextPoem.id || null);

      const newIndex = nextPoem.index;
      setCurrentIndex(newIndex);
      fetchPoem(newIndex);
    }
  };

  const handlePrev = () => {
    // Going to Older (higher index)
    if (previousPoem && previousPoem.index !== undefined) {
      setCurrentPoem(previousPoem.poem || '');
      setColors(previousPoem.palette || []);
      setTitle(previousPoem.title || '');
      setDayOfWeek(previousPoem.dayOfWeek || '');
      setDate(previousPoem.date || null);
      setMonth(previousPoem.month || '');
      setYear(previousPoem.year || null);
      setIsFavorite(previousPoem.isFavorite || false);
      setCurrentPoemId(previousPoem.id || null);

      const newIndex = previousPoem.index;
      setCurrentIndex(newIndex);
      fetchPoem(newIndex);
    }
  };

  const handleNavigateToPoem = (index) => {
    setCurrentIndex(index);
    fetchPoem(index);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleDelete = async () => {
    if (!currentPoemId || !user) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/deletePoem?id=${currentPoemId}&userid=${user.uid}`,
        { method: 'DELETE' },
      );
      if (!res.ok) throw new Error('Failed to delete poem');
      // Refresh the current index (or the previous one if possible)
      fetchPoem(currentIndex);
      // Trigger navbar refresh
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error deleting poem:', err);
      setError('Failed to delete poem');
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentPoemId || !user) return;
    try {
      // Optimistic update
      const newStatus = !isFavorite;
      setIsFavorite(newStatus);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/toggleFavorite`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentPoemId,
            userid: user.uid,
            status: newStatus,
          }),
        },
      );

      if (!res.ok) {
        // Revert on failure
        setIsFavorite(!newStatus);
        throw new Error('Failed to toggle favorite');
      }

      // Refresh navbar to update order and favorite icon
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setError('Failed to update favorite status');
    }
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return (
      <Page>
        <Auth />
      </Page>
    );
  }

  return (
    <Page>
      <NavBar
        currentIndex={currentIndex}
        handleNavigateToPoem={handleNavigateToPoem}
        user={user}
        onLogout={handleLogout}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        poems={poems}
      />
      <PrimaryPageContents>
        <TopBar onLogout={handleLogout} handleMenuClick={handleMenuClick} />
        <Poem
          title={title}
          text={currentPoem}
          colors={colors}
          dayOfWeek={dayOfWeek}
          date={date}
          month={month}
          year={year}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
        />
        <PageNavigation
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={!!nextPoem}
          hasPrev={!!previousPoem}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </PrimaryPageContents>
    </Page>
  );
}

export default Home;
