import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background: ${(props) => (props.$active ? '#444' : 'none')};
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
      ? '4px 0px 0px rgba(0, 221, 99, 0.33), -4px 0px 0px rgba(247, 0, 78, 0.25)'
      : 'none'};

  &:hover {
    background-color: ${(props) =>
      props.$active ? '#444' : 'rgba(0, 0, 0, 0.05)'};
    box-shadow:
      4px 0px 0px rgba(0, 221, 99, 0.33),
      -4px 0px 0px rgba(247, 0, 78, 0.25);
  }

  @media (max-width: 800px) {
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
  return (
    <StyledButton $active={active} onClick={onClick} {...props}>
      {Icon && (
        <Icon
          size={size}
          // fill={active ? '#eae7e4' : '#444'}
          // stroke={active ? '#eae7e4' : '#444'}
          color={active ? '#eae7e4' : '#444'}
        />
      )}
    </StyledButton>
  );
};

export default IconButton;
