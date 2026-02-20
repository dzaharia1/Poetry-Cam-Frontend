import React from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[4]};
  width: 100%;
`;

const TabButton = styled.button`
  background: none;
  border: none;

  flex: 1;
  padding: 0 0 ${(props) => props.theme.spacing[3]} 0;
  border-color: ${(props) =>
    props.$active ? props.theme.colors.primary : 'transparent'};
  border-bottom-width: ${(props) => props.theme.spacing[1]};
  border-bottom-style: solid;

  color: ${(props) =>
    props.$active
      ? props.theme.colors.text.primary
      : props.theme.colors.text.secondary};
  font-size: 1rem;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  font-family: ${(props) => props.theme.typography.fontFamily.body};
  transition: all 0.2s ease;

  cursor: pointer;
`;

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <TabsContainer>
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          $active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}>
          {tab.label}
        </TabButton>
      ))}
    </TabsContainer>
  );
};

export default Tabs;
