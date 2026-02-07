import styled from 'styled-components';
import NavItem from './NavItem';
import { LogOut, Settings } from 'lucide-react';
import IconButton from '../basecomponents/IconButton';

const NavBarContainer = styled.nav`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 6rem);

  background-color: ${(props) => props.theme.colors.secondary};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 24px;
  // padding-bottom: 12rem;
  margin: 0 0 0 1rem;

  box-shadow:
    ${(props) => props.theme.colors.shadows.nav1},
    ${(props) => props.theme.colors.shadows.nav2};
  overflow: hidden;

  width: 20%;
  max-width: 400px;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
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

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${(props) => props.theme.spacing[3]};

  border-top: 1px solid ${(props) => props.theme.colors.border};
  padding: 1rem;

  background-color: ${(props) => props.theme.colors.secondary};
`;

const ButtonDivider = styled.div`
  width: 1px;
  height: 100%;
  background-color: ${(props) => props.theme.colors.border};
`;

const LogoutButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  // justify-content: center;
  color: ${(props) => props.theme.colors.text.primary};
  text-decoration: none;
`;

const NavBar = ({
  currentIndex,
  handleNavigateToPoem,
  onLogout,
  isMenuOpen,
  setIsMenuOpen,
  poems = [],
  setIsSettingsOpen,
}) => {
  return (
    <>
      {isMenuOpen && <Scrim onClick={() => setIsMenuOpen(false)} />}
      <NavBarContainer isMenuOpen={isMenuOpen}>
        <ScrollArea>
          <NavBarTitle>Your Poems</NavBarTitle>
          {poems.map((poem, index) => (
            <NavItem
              key={poem.id}
              onClick={() => handleNavigateToPoem(index)}
              title={poem.title}
              colors={poem.palette}
              active={index === currentIndex}
              isFavorite={poem.isFavorite}
            />
          ))}
        </ScrollArea>
        <BottomControls>
          <LogoutButton href="" onClick={onLogout}>
            <LogOut size={18} />
            Log out
          </LogoutButton>
          <ButtonDivider />
          <IconButton
            icon={Settings}
            onClick={() => setIsSettingsOpen(true)}
            title="Settings"
            size={20}
          />
        </BottomControls>
      </NavBarContainer>
    </>
  );
};

export default NavBar;
