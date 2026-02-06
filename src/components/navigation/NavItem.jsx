import React from 'react';
import styled from 'styled-components';
import { Star } from 'lucide-react';

const NavItemItself = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 24px;
  width: calc(100% - 0.5rem);

  background: none;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 0 0.75rem;
  margin: 0.25rem 0.25rem 0.5rem 0.25rem;
  transition: all 0.3s ease-out;

  overflow: hidden;

  ${(props) =>
    props.active &&
    `cursor: pointer;
    border: 1px solid ${props.theme.colors.border};
    padding-top: .5rem;
    padding-bottom: 1rem;
    height: 48px;`}

  &:hover {
    cursor: pointer;
    border: 1px solid ${(props) => props.theme.colors.border};
    padding-top: 0.5rem;
    padding-bottom: 1rem;
    height: 48px;
  }
`;

const NavItemTitle = styled.p`
  width: 100%;
  padding: 0;
  margin: 0;

  font-family: ${(props) => props.theme.typography.fontFamily.heading};
  font-weight: 500;
  font-size: 1.125rem;
  letter-spacing: unset;
  text-align: left;

  color: ${(props) => props.theme.colors.text.headings};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  overflow: hidden;
`;

const TitleText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const NavItemColorCollection = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  text-align: left;
  width: 100%;
  max-height: 0px;
  transition: max-height 0.3s ease-out;
  overflow: hidden;

  ${(props) => props.active && `max-height: 10px; margin-top: 0.125rem;`}
`;
const NavItemColor = styled.div`
  flex: 1;
  height: 10px;
`;

const NavItem = ({ title, active, colors, onClick, isFavorite = false }) => {
  const [hovered, setHovered] = React.useState('false');

  return (
    <NavItemItself
      onClick={onClick}
      onMouseEnter={() => setHovered('true')}
      onMouseLeave={() => setHovered('false')}
      active={hovered === 'true' || active}>
      <NavItemTitle>
        <TitleText>{title}</TitleText>
        {isFavorite && (
          <Star
            size={14}
            fill="#444444"
            stroke="#444444"
            style={{ flexShrink: 0, marginRight: '0.25rem' }}
          />
        )}
      </NavItemTitle>
      <NavItemColorCollection active={hovered === 'true' || active}>
        {colors.map((color, index) => (
          <NavItemColor key={index} style={{ backgroundColor: color }} />
        ))}
      </NavItemColorCollection>
    </NavItemItself>
  );
};

export default NavItem;
