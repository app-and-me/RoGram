import React from 'react';
import { styled } from 'styled-components';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import theme from '@/styles/theme';
import typo from '@/styles/typo';
import Icon from '@/components/Icon';

interface LessonSection {
  title: string;
  content: string;
  code?: string;
}

interface LessonContentProps {
  title: string;
  sections?: LessonSection[];
  markdown?: string;
  hasTasks?: boolean;
  onGoToTask?: () => void;
}

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80vh;
  max-width: 480px;
  padding: ${theme.Component.Spacing[550]}px;
  gap: ${theme.Component.Spacing[900]}px;
  overflow-y: auto;
`;

const TaskButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${theme.Component.Spacing[200]}px;
  padding: ${theme.Component.Spacing[400]}px ${theme.Component.Spacing[500]}px;
  background-color: ${theme.Color.Core.AccentTranslucent};
  border: none;
  border-radius: ${theme.Component.Radius[400]}px;
  cursor: pointer;
  margin-bottom: ${theme.Component.Spacing[800]}px;
  align-self: flex-start;

  &:hover {
    background-color: ${theme.Color.Components.Interactive.Hover};
  }
`;

const MarkdownContainer = styled.div``;

const TaskButtonText = styled.span`
  ${typo.Body.Regular};
  color: ${theme.Color.Core.Accent};
`;

const LessonContent: React.FC<LessonContentProps> = ({ markdown, hasTasks, onGoToTask }) => {
  return (
    <ContentContainer>
      <MarkdownContainer>{markdown && <MarkdownRenderer content={markdown} />}</MarkdownContainer>
      {hasTasks && (
        <TaskButton onClick={onGoToTask}>
          <Icon name='assignment_fill' size={24} color={theme.Color.Core.Accent} />
          <TaskButtonText>과제하러 가기</TaskButtonText>
        </TaskButton>
      )}
    </ContentContainer>
  );
};

export default LessonContent;
