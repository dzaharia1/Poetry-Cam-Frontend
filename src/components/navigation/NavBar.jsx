import { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavItem from './NavItem';
import { LogOut } from 'lucide-react';

const NavBarContainer = styled.nav`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 6rem);

  background-color: #f4f2edff;
  border: 1px solid #ccc;
  border-radius: 24px;
  // padding-bottom: 12rem;
  margin: 3rem 0 0 1rem;

  box-shadow:
    0 2px 35px rgba(0, 0, 0, 0.1),
    0 0px 2px rgba(0, 0, 0, 0.21);
  overflow: hidden;

  width: 20%;
  max-width: 400px;

  @media (max-width: 1120px) {
    position: absolute;
    top: 1rem;
    left: 1rem;
    bottom: 1rem;
    width: calc(100% - 4rem);
    max-width: 400px;
    z-index: 1000;

    ${(props) => !props.isMenuOpen && `left: calc(0px - (100% + 2rem));`}
  }
`;

const Scrim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;

  @media (min-width: 1120px) {
    opacity: 0;
    visibility: hidden;
  }
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  // overscroll-behavior: contain;
  width: 100%;
`;

const NavBarTitle = styled.h3`
  letter-spacing: 1px;
  padding: 1.75rem 1rem 1rem 1rem;
`;

const BottomControls = styled.div`
  display: flex;
  flex-direction: column;

  border-top: 1px solid #ccc;
  padding: 1rem;

  background-color: #f4f2edff;
`;

const LogoutButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  // justify-content: center;
  color: #494949ff;
  text-decoration: none;
`;

const NavBar = ({
  currentIndex,
  handleNavigateToPoem,
  user,
  onLogout,
  isMenuOpen,
  setIsMenuOpen,
  refreshTrigger,
}) => {
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
    if (user) {
      fetchPoems();
    }
  }, [user, refreshTrigger]);

  return (
    <>
      {isMenuOpen && <Scrim onClick={() => setIsMenuOpen(false)} />}
      <NavBarContainer isMenuOpen={isMenuOpen}>
        <ScrollArea>
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
        </ScrollArea>
        <BottomControls>
          <LogoutButton href="" onClick={onLogout}>
            <LogOut size={18} />
            Log out
          </LogoutButton>
        </BottomControls>
      </NavBarContainer>
    </>
  );
};

export default NavBar;
