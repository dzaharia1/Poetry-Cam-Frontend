import React from 'react';
import styled, { useTheme } from 'styled-components';

const StyledButton = styled.button`
  background: ${(props) =>
    props.$active ? props.theme.colors.primary : 'none'};
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.2s;
  // color: ${(props) => (props.$active ? '#00dd63' : '#444')};
  box-shadow: ${(props) =>
    props.$active
      ? `4px 0px 0px ${props.theme.colors.shadows.green}, -4px 0px 0px ${props.theme.colors.shadows.red}`
      : 'none'};

  &:hover {
    background-color: ${(props) =>
      props.$active ? props.theme.colors.primary : 'rgba(0, 0, 0, 0.05)'};
    box-shadow:
      4px 0px 0px ${(props) => props.theme.colors.shadows.green},
      -4px 0px 0px ${(props) => props.theme.colors.shadows.red};
    transform: scale(1.03);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 28px;
    height: 28px;
  }
`;

const IconButton = ({
  icon: Icon,
  active = false,
  onClick,
  size = 24,
  ...props
}) => {
  const theme = useTheme();

  return (
    <StyledButton $active={active} onClick={onClick} {...props}>
      {Icon && (
        <Icon
          size={size}
          color={active ? theme.colors.secondary : theme.colors.text.headings}
        />
      )}
    </StyledButton>
  );
};

export default IconButton;
