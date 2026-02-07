import { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import Button from './basecomponents/Button';
import { auth } from '../firebase';
import { getFriendlyErrorMessage } from '../utils/firebaseErrorHandling';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  width: 90%;
  height: 100%;
  max-width: 400px;
  padding: 20vh 0;
`;

const WordMark = styled.img`
  width: 100%;
  max-width: 800px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.paper};
  color: ${(props) => props.theme.colors.text.primary};
  transition: all 0.3s ease;

  &::placeholder {
    color: ${(props) => props.theme.colors.text.secondary};
  }
`;

const ErrorText = styled.p`
  color: ${(props) => props.theme.colors.text.error};
  margin: 0;
  font-size: 14px;
  width: 100%;
`;

const ToggleText = styled.p`
  cursor: pointer;
  textalign: center;
  font-size: 14px;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: 10px;
  width: 100%;
  text-align: center;

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
  flex: 1;
`;

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const { isDarkMode } = useTheme();

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
      setError(getFriendlyErrorMessage(err));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <AuthContainer>
      <WordMark
        src={isDarkMode ? 'wordmarkdark.svg' : 'wordmark.svg'}
        alt="Poetry Cam"
      />
      {error && <ErrorText>{error}</ErrorText>}
      <Form onSubmit={handleAuth}>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
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
        <Button type="submit" style={{ width: '100%' }}>
          {isRegistering ? 'Register' : 'Login'}
        </Button>
        <Button
          onClick={handleGoogleLogin}
          variant="secondary"
          style={{ width: '100%' }}>
          Register or Sign in with Google
        </Button>
      </Form>
      <ToggleText onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering
          ? 'Already have an account? Login'
          : 'Need an account? Register'}
      </ToggleText>
    </AuthContainer>
  );
}

export default Auth;
