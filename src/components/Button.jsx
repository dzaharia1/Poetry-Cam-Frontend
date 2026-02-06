import styled, { css } from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 16px;
  background: #333;
  color: white;
  font-family: 'Young Serif', serif;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0px 0px 0px rgba(0, 221, 99, 0.33),
    0px 0px 0px rgba(247, 0, 78, 0.25);

  &:hover {
    background: #222;
    box-shadow:
      4px 0px 0px rgba(0, 221, 99, 0.33),
      -4px 0px 0px rgba(247, 0, 78, 0.25);
  }

  ${(props) =>
    props.variant === 'secondary' &&
    css`
      background: #f4f2edff;
      border: 1px solid #ccc;
      transition: all 0.3s ease;
      color: #333;

      &:hover {
        background: #f9f7f3ff;
        box-shadow:
          4px 0px 0px rgba(0, 221, 99, 0.33),
          -4px 0px 0px rgba(247, 0, 78, 0.25);
      }
    `}

  &:disabled {
    opacity: 0.5;
    box-shadow: none;
    cursor: not-allowed;

    &:hover {
      box-shadow: none;
    }
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
