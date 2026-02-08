import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Poem from './poem/Poem';
import TopBar from './TopBar';
import PageNavigation from './PageNavigation';
import NavBar from './navigation/NavBar';
import SplashScreen from './SplashScreen';
import PoemSkeleton from './poem/PoemSkeleton';
import Settings from './Settings';
import Auth from './Auth';
import { getBackendUrl } from '../utils/api';
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
  const [penName, setPenName] = useState('');
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
  // const [hasUnreadPoem, setHasUnreadPoem] = useState(false);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPoemId, setCurrentPoemId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [poems, setPoems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasMissingApiKey, setHasMissingApiKey] = useState(false);
  const [sortMode, setSortMode] = useState(() => {
    const saved = localStorage.getItem('poemSortMode');
    return saved || 'date';
  });

  useEffect(() => {
    const fetchPoems = async () => {
      if (!user) return;
      try {
        const response = await fetch(
          getBackendUrl('/poemList', {
            userid: user.uid,
            sortByDate: sortMode === 'date' ? 'true' : 'false',
          }),
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
  }, [user, refreshTrigger, sortMode]);

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

  // Fetch settings when user is set
  useEffect(() => {
    if (user) {
      fetch(getBackendUrl('/get-settings', { userid: user.uid }))
        .then((res) => res.json())
        .then((data) => {
          if (data.penName) setPenName(data.penName);

          // Check for API Key
          if (data.hasGeminiApiKey === false) {
            setHasMissingApiKey(true);
            setError(
              'Please configure your Gemini API Key in Settings to generate poems.',
            );
            setIsSettingsOpen(true);
          }
        })
        .catch((err) => console.error('Error fetching settings:', err));
    }
  }, [user]);

  // Helper to fetch poem data from backend
  const fetchPoem = useCallback(
    async (index, additionalParams = {}) => {
      if (!user) return;
      try {
        const res = await fetch(
          getBackendUrl('/getPoem', {
            userid: user.uid,
            index: index,
            sortByDate: sortMode === 'date' ? 'true' : 'false',
            ...additionalParams,
          }),
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
    [user, sortMode],
  );

  const handleCapture = async (file) => {
    if (!user || !file) return;
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(
        getBackendUrl('/generate-poem', { userid: user.uid }),
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!res.ok) throw new Error('Failed to generate poem');

      // Refresh the list to find the new poem's position in the current sort
      const listRes = await fetch(
        getBackendUrl('/poemList', {
          userid: user.uid,
          sortByDate: sortMode === 'date' ? 'true' : 'false',
        }),
      );
      const listData = await listRes.json();

      if (Array.isArray(listData)) {
        setPoems(listData);

        let targetIndex = 0;
        if (sortMode === 'date') {
          // In date mode, the newest poem is always at index 0
          targetIndex = 0;
        } else {
          // In fave mode, find the first non-favorite poem (which should be the new one)
          const newIndex = listData.findIndex((p) => !p.isFavorite);
          targetIndex = newIndex >= 0 ? newIndex : 0;
        }

        await fetchPoem(targetIndex);
      } else {
        // Fallback
        await fetchPoem(0);
      }

      // Trigger navbar refresh to ensure sync
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error generating poem:', err);
      setError('Failed to generate poem. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Initial fetch on load
  useEffect(() => {
    if (user && currentIndex === 0) {
      fetchPoem(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            // setHasUnreadPoem(true);

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
        getBackendUrl('/deletePoem', {
          id: currentPoemId,
          userid: user.uid,
        }),
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

      const res = await fetch(getBackendUrl('/toggleFavorite'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentPoemId,
          userid: user.uid,
          status: newStatus,
        }),
      });

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

  const handleSortModeChange = (newMode) => {
    setSortMode(newMode);
    localStorage.setItem('poemSortMode', newMode);
    // Refresh poems list with new sort
    setRefreshTrigger((prev) => prev + 1);
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

  const handleSettingsOpen = () => {
    setIsMenuOpen(false);
    setIsSettingsOpen(true);
  };

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
        setIsSettingsOpen={handleSettingsOpen}
        sortMode={sortMode}
        onSortModeChange={handleSortModeChange}
      />
      <PrimaryPageContents>
        <TopBar
          onLogout={handleLogout}
          handleMenuClick={handleMenuClick}
          onCapture={handleCapture}
        />
        {isGenerating ? (
          <PoemSkeleton />
        ) : (
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
            penName={penName}
          />
        )}
        <PageNavigation
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={!!nextPoem}
          hasPrev={!!previousPoem}
          onCapture={handleCapture}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {isSettingsOpen && (
          <Settings
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            title="Settings"
            missingApiKey={hasMissingApiKey}
          />
        )}
      </PrimaryPageContents>
    </Page>
  );
}

export default Home;
