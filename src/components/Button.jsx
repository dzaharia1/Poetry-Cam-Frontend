import styled, { css } from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 16px;
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.text.light};
  font-family: ${(props) => props.theme.typography.fontFamily.heading};
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0px 0px 0px ${(props) => props.theme.colors.shadows.green},
    0px 0px 0px ${(props) => props.theme.colors.shadows.red};

  &:hover {
    background: ${(props) => props.theme.colors.primaryHover};
    box-shadow:
      4px 0px 0px ${(props) => props.theme.colors.shadows.green},
      -4px 0px 0px ${(props) => props.theme.colors.shadows.red};
    transform: scale(1.015);
  }

  ${(props) =>
    props.variant === 'secondary' &&
    css`
      background: ${(props) => props.theme.colors.secondary};
      border: 1px solid ${(props) => props.theme.colors.border};
      transition: all 0.3s ease;
      color: ${(props) => props.theme.colors.text.primary};

      &:hover {
        background: ${(props) => props.theme.colors.secondaryHover};
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
