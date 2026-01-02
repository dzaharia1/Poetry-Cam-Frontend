import { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavItem from './NavItem';

const NavBarContainer = styled.nav`
  display: flex;
  flex-direction: column;
  // padding: 1rem;
  background-color: #f4f2edff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 35px rgba(0, 0, 0, 0.1), 0 0px 2px rgba(0, 0, 0, 0.21);
  border-radius: 24px;
  margin: 1rem 0 0 1rem;
  height: calc(100vh - 2rem);
  overflow-y: scroll;
`;

const NavBarTitle = styled.h3`
  padding: 1.75rem 1rem 1rem 1rem;
`;

const BottomControls = styled.div`
  display: flex;
  flex-direction: column;

  border-top: 1px solid #ccc;
  padding: 1rem;
`;

const LogoutButton = styled.a`
  color: #494949ff;
  text-decoration: none;
`;

const NavBar = ({ currentIndex, handleNavigateToPoem, user, onLogout }) => {
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/poemList?userid=${user.uid}`,
        );
        const data = await response.json();
        setPoems(data);
      } catch (error) {
        console.error('Error fetching poems:', error);
      }
    };
    fetchPoems();
  }, []);

  return (
    <NavBarContainer>
      <NavBarTitle>Your Poems</NavBarTitle>
      {poems.map((poem, index) => (
        <NavItem
          key={index}
          onClick={() => handleNavigateToPoem(index)}
          title={poem.title}
          colors={poem.palette}
          active={index === currentIndex}
        />
      ))}
      <BottomControls>
        <LogoutButton href="" onClick={onLogout}>
          Log out
        </LogoutButton>
      </BottomControls>
    </NavBarContainer>
  );
};

export default NavBar;
