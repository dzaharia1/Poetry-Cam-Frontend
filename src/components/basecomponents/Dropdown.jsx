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

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background-color: ${(props) =>
    props.theme.colors.inputBackground || props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 1rem;
  outline: none;
  width: 100%;
  cursor: pointer;
  appearance: none; /* Remove default arrow on some browsers for custom styling if needed, but keeping simple for now */

  /* Add custom arrow if desired, but default is fine for MVP */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${(
    props,
  ) =>
    encodeURIComponent(
      props.theme.colors.text.primary,
    )}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem; /* Space for the arrow */
  box-sizing: border-box;
  transition: border 0.2s;

  &:focus {
    border: 1px solid ${(props) => props.theme.colors.shadows.border};
  }
`;

const Option = styled.option`
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.text.primary};
`;

const Dropdown = ({ label, options = [], ...props }) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <Select {...props}>
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Container>
  );
};

export default Dropdown;
