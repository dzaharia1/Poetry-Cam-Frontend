import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.text.primary};
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  background-color: ${(props) =>
    props.theme.colors.inputBackground || props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 1rem;
  outline: none;
  border: 1px solid ${(props) => props.theme.colors.border};
  width: 100%;
  box-sizing: border-box;
  transition: border 0.2s;

  &:focus {
    border: 1px solid ${(props) => props.theme.colors.shadows.border};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.secondary};
  }
`;

const ErrorText = styled.span`
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.text.delete};
  margin-top: 0.25rem;
`;

const TextInput = ({ label, error, type = 'text', ...props }) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <Input type={type} error={error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

export default TextInput;
