import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from './components/Card';
import ColorCollection from './components/ColorCollection';
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
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #333;
  flex-direction: column;
`;

const PoemHeading = styled.h2`
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const PoemText = styled.pre`
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 16px;
  white-space: pre-wrap;
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

const Button = styled.button`
  padding: 10px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #555;
  }
`;

const LogoutButton = styled(Button)`
  margin-top: 20px;
  background: #d9534f;
  &:hover {
    background: #c9302c;
  }
`;

function App() {
  const [user, setUser] = useState(null);
  const [poem, setPoem] = useState('');
  const [colors, setColors] = useState([]);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setPoem('');
      setTitle('');
      setColors([]);
      return;
    }

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
          const data = snapshot.docs[0].data();
          setPoem(data.poem || '');
          setColors(data.palette || []);
          setTitle(data.title || '');
        } else {
          setPoem('No poems yet. Generate one!');
          setTitle('Welcome');
          setColors([]);
        }
      },
      (err) => {
        console.error('Error fetching poems:', err);
        // Fallback for when indexes are building or other errors
        if (err.code === 'failed-precondition') {
          setError(
            'Firestore index might be building or missing. Check console.',
          );
        }
      },
    );

    return () => unsubscribe();
  }, [user]);

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
      <Card backgroundcolor={'#f4f2edff'}>
        <PoemHeading>{title}</PoemHeading>
        <PoemText>{poem}</PoemText>
        <ColorCollection colors={colors} />
      </Card>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </Page>
  );
}

export default App;
