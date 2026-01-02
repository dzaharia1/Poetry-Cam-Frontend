import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Poem from './components/Poem';
import TopBar from './components/TopBar';
import PageNavigation from './components/PageNavigation';
import NavBar from './components/navigation/NavBar';
import Button from './components/Button';
import { auth, db } from './firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
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
  align-items: flex-start;
  // padding: 0 0 2rem 0;
  width: 100%;
`;

const PrimaryPageContents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  width: 75%;
  // max-width: 900px;

  padding: 1rem 0;

  font-size: 24px;
  color: #333;

  @media (max-width: 1120px) {
    width: 100%;
  }
`;

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const formatPoem = (poem) => {
  return poem.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));
};

function App() {
  const [user, setUser] = useState(null);
  const [currentPoem, setCurrentPoem] = useState('');
  /* Pagination State */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextPoem, setNextPoem] = useState(null); // Newer
  const [previousPoem, setPreviousPoem] = useState(null); // Older
  const [colors, setColors] = useState([]);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [hasUnreadPoem, setHasUnreadPoem] = useState(false);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Helper to fetch poem data from backend
  const fetchPoem = useCallback(
    async (index) => {
      if (!user) return;
      try {
        // Assuming backend is on localhost:3109 given the context
        const res = await fetch(
          `http://localhost:3109/getPoem?userid=${user.uid}&index=${index}`,
        );
        if (!res.ok) throw new Error('Failed to fetch poem');
        const data = await res.json();

        // Update current poem if it exists in the API response
        if (data.currentPoem) {
          setCurrentPoem(formatPoem(data.currentPoem.poem || ''));
          setColors(data.currentPoem.palette || []);
          setTitle(data.currentPoem.title || '');
          if (data.currentPoem.index !== undefined) {
            setCurrentIndex(data.currentPoem.index);
          }
        } else {
          if (index === 0) {
            setCurrentPoem('No poems yet. Generate one!');
            setTitle('Welcome');
            setColors([]);
          }
        }

        // Update neighbors
        setNextPoem(data.nextPoem);
        setPreviousPoem(data.previousPoem);
      } catch (err) {
        console.error('Error fetching poem:', err);
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
      setCurrentPoem(formatPoem(nextPoem.poem || ''));
      setColors(nextPoem.palette || []);
      setTitle(nextPoem.title || '');

      const newIndex = nextPoem.index;
      setCurrentIndex(newIndex);
      fetchPoem(newIndex);
    }
  };

  const handlePrev = () => {
    // Going to Older (higher index)
    if (previousPoem && previousPoem.index !== undefined) {
      setCurrentPoem(formatPoem(previousPoem.poem || ''));
      setColors(previousPoem.palette || []);
      setTitle(previousPoem.title || '');

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

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!user) {
    return (
      <Page>
        <AuthContainer>
          <h2>{isRegistering ? 'Register' : 'Login'}</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form
            onSubmit={handleAuth}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">
              {isRegistering ? 'Register' : 'Login'}
            </Button>
          </form>
          <Button onClick={handleGoogleLogin} style={{ background: '#4285F4' }}>
            Sign in with Google
          </Button>
          <p
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ cursor: 'pointer', textAlign: 'center' }}>
            {isRegistering
              ? 'Already have an account? Login'
              : 'Need an account? Register'}
          </p>
        </AuthContainer>
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
      />
      <PrimaryPageContents>
        <TopBar onLogout={handleLogout} handleMenuClick={handleMenuClick} />
        <Poem title={title} text={currentPoem} colors={colors} />
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

export default App;
