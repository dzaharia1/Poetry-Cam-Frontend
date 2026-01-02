import styled, { css } from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #333;
  color: white;
  font-family: 'Young Serif', serif;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  &:hover {
    background: #555;
  }

  ${(props) =>
    props.variant === 'secondary' &&
    css`
      background: #f4f2edff;
      box-shadow: 0 2px 35px rgba(0, 0, 0, 0.1);
      border: 1px solid #ccc;
      transition: background 0.3s ease;
      color: #333;

      &:hover {
        background: #eae7e0ff;
      }
    `}

  &:disabled {
    opacity: 0.5;
    drop-shadow: none;
    cursor: not-allowed;
  }
`;

const Button = ({ variant = 'primary', startIcon, endIcon, ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      {startIcon}
      {props.children}
      {endIcon}
    </StyledButton>
  );
};

export default Button;
