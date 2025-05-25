import { styled } from 'styled-components';
import theme from '@/styles/theme';
import typo from '@/styles/typo';
import Icon from '@/components/Icon';
import React, { useEffect, useRef } from 'react';

export interface Step {
  id: string;
  title: string;
  icon?: string;
  isActive?: boolean;
}

interface ProgressBreadcrumbProps {
  steps: Step[];
  onStepClick?: (stepId: string) => void;
}

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${theme.Component.Spacing[400]}px ${theme.Component.Spacing[700]}px;
  gap: ${theme.Component.Spacing[400]}px;
  border-bottom: 1px solid ${theme.Color.Line.Divider};
  background-color: ${theme.Color.Background.Standard.Primary};
  overflow-x: auto;
  white-space: nowrap;
`;

const BreadcrumbStep = styled.div<{ $isCurrent?: boolean; $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  cursor: pointer;

  ${({ $isActive }) =>
    !$isActive &&
    `
    opacity: 0.5;
  `}

  &:hover {
    opacity: 1;
  }
`;

const StepTitle = styled.span<{ $isCurrent?: boolean }>`
  ${typo.Body.Regular};
  color: ${({ $isCurrent }) =>
    $isCurrent ? theme.Color.Content.Standard.Primary : theme.Color.Content.Standard.Tertiary};
  font-weight: ${({ $isCurrent }) => ($isCurrent ? '700' : '500')};
`;

const Separator = styled.div`
  display: flex;
  align-items: center;
  margin: 0 4px;
  color: ${theme.Color.Content.Standard.Tertiary};
`;

const ProgressBreadcrumb: React.FC<ProgressBreadcrumbProps> = ({ steps, onStepClick }) => {
  const activeStepRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [steps]);

  const handleStepClick = (stepId: string) => {
    if (onStepClick) {
      onStepClick(stepId);
    }
  };

  return (
    <BreadcrumbContainer>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <BreadcrumbStep
            ref={step.isActive ? activeStepRef : null}
            $isActive={step.isActive}
            onClick={() => handleStepClick(step.id)}
          >
            {step.icon && (
              <Icon
                name={step.icon}
                size={20}
                color={
                  step.isActive
                    ? theme.Color.Content.Standard.Primary
                    : theme.Color.Content.Standard.Tertiary
                }
              />
            )}
            <StepTitle $isCurrent={step.isActive}>{step.title}</StepTitle>
          </BreadcrumbStep>
          {index < steps.length - 1 && (
            <Separator>
              <Icon name='arrow_forward' size={20} color={theme.Color.Content.Standard.Tertiary} />
            </Separator>
          )}
        </React.Fragment>
      ))}
    </BreadcrumbContainer>
  );
};

export default ProgressBreadcrumb;
