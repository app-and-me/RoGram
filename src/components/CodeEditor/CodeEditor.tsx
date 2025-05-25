import { useState, useCallback } from 'react';
import { styled } from 'styled-components';
import theme from '@/styles/theme';
import typo from '@/styles/typo';
import Icon from '@/components/Icon';

interface CodeEditorProps {
  initialCode?: string;
  isTask?: boolean;
  onExecute?: (code: string) => void;
  onReset?: () => void;
  onSubmit?: (code: string) => void;
  removeOutput?: () => void;
  setOutput?: (output: string) => void;
  output?: string;
  language?: string;
  solution?: string;
}

const verifyCodeSolution = (userCode: string, solutionCode: string): boolean => {
  if (!solutionCode) return false;

  const cleanCode = (code: string): string => {
    return code
      .replace(/#.*$/gm, '')
      .replace(/\s+/g, '')
      .replace(/\n/g, '')
      .replace(/print\(['"]?([^'"]*?)['"]?\)/g, 'print($1)')
      .trim();
  };

  const normalizeCode = (cleanedCode: string): string => {
    let normalizedCode = cleanedCode.replace(/def(\w+)\(/g, 'def(');

    let variableIndex = 0;
    const variableMap = new Map<string, string>();

    const variablePattern = /([a-zA-Z_][a-zA-Z0-9_]*)=/g;
    let match;

    while ((match = variablePattern.exec(normalizedCode)) !== null) {
      const varName = match[1];
      if (!variableMap.has(varName)) {
        variableMap.set(varName, `var${variableIndex++}`);
      }
    }

    for (const [original, replacement] of variableMap.entries()) {
      const variableRegex = new RegExp(`\\b${original}\\b`, 'g');
      normalizedCode = normalizedCode.replace(variableRegex, replacement);
    }

    return normalizedCode;
  };

  const cleanUserCode = cleanCode(userCode);
  const cleanSolutionCode = cleanCode(solutionCode);

  if (cleanUserCode === cleanSolutionCode) {
    return true;
  }

  const normalizedUserCode = normalizeCode(cleanUserCode);
  const normalizedSolutionCode = normalizeCode(cleanSolutionCode);

  return normalizedUserCode === normalizedSolutionCode;
};

const extractSolutionCode = (taskContent: string): string => {
  const solutionMatch = taskContent?.match(/```solution\n([\s\S]*?)```/);
  return solutionMatch ? solutionMatch[1].trim() : '';
};

const SuccessPopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${theme.Color.Components.Fill.Standard.Secondary};
  border-radius: ${theme.Component.Radius[300]}px;
  padding: ${theme.Component.Spacing[500]}px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
  max-width: 450px;
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;

const SuccessIcon = styled.div`
  background-color: ${theme.Color.Core.Status.Positive};
  color: white;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.Component.Spacing[300]}px;
  box-shadow: 0px 4px 12px rgba(39, 174, 96, 0.3);
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const SuccessTitle = styled.h3`
  ${typo.Title.Strong};
  color: ${theme.Color.Content.Standard.Primary};
  margin-bottom: ${theme.Component.Spacing[200]}px;
`;

const SuccessMessage = styled.p`
  ${typo.Body.Regular};
  color: ${theme.Color.Content.Standard.Secondary};
  margin-bottom: ${theme.Component.Spacing[400]}px;
  line-height: 1.5;
`;

const CloseButton = styled.button`
  ${typo.Body.Regular};
  background-color: ${theme.Color.Components.Fill.Inverted.Primary};
  color: ${theme.Color.Content.Inverted.Primary};
  border: none;
  border-radius: ${theme.Component.Radius[200]}px;
  padding: ${theme.Component.Spacing[200]}px ${theme.Component.Spacing[400]}px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  animation: fadeIn 0.3s ease-in-out;
`;

const executeCode = async (
  code: string,
  updateOutput?: (text: string) => void
): Promise<string> => {
  const fs = await import('fs');
  const { exec } = await import('child_process');

  const timestamp = Date.now();
  const filename = `temp_${timestamp}.py`;

  return new Promise((resolve, reject) => {
    fs.writeFile(filename, code, (writeErr) => {
      if (writeErr) {
        reject(`Error writing file: ${writeErr.message}`);
        return;
      }

      const process = exec(`python3 ${filename}`);

      process.stdout?.on('data', (data) => {
        if (updateOutput) updateOutput(data);
      });

      process.stderr?.on('data', (data) => {
        if (updateOutput) updateOutput(data);
      });

      process.on('close', (code) => {
        fs.unlink(filename, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting file: ${unlinkErr.message}`);
          }
        });

        if (code === 0) {
          resolve('Execution completed successfully.');
        } else {
          reject(`Execution failed with code ${code}.`);
        }
      });
    });
  });
};

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-left: 1px solid ${theme.Color.Line.Divider};
  flex: 1;
  overflow: hidden;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  border-bottom: 1px solid ${theme.Color.Line.Divider};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.Component.Spacing[150]}px;
  padding: ${theme.Component.Spacing[200]}px ${theme.Component.Spacing[500]}px;
  background-color: ${theme.Color.Components.Translucent.Tertiary};
`;

const SectionTitle = styled.span`
  ${typo.Footnote.Regular};
  color: ${theme.Color.Content.Standard.Tertiary};
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${theme.Component.Spacing[150]}px;
`;

const Button = styled.button<{ $variant: 'execute' | 'reset' | 'submit' | 'clear' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.Component.Spacing[100]}px;
  padding: ${theme.Component.Spacing[150]}px ${theme.Component.Spacing[300]}px;
  border-radius: ${theme.Component.Radius[200]}px;
  ${typo.Footnote.Regular};
  cursor: pointer;

  ${({ $variant }) => {
    switch ($variant) {
      case 'execute':
        return `
          background-color: ${theme.Color.Solid.Translucent.Green};
          color: ${theme.Color.Core.Status.Positive};
        `;
      case 'reset':
        return `
          background-color: ${theme.Color.Solid.Translucent.Red};
          color: ${theme.Color.Core.Status.Negative};
        `;
      case 'submit':
        return `
          background-color: ${theme.Color.Components.Fill.Inverted.Primary};
          color: ${theme.Color.Content.Inverted.Primary};
        `;
      case 'clear':
        return `
          background-color: ${theme.Color.Components.Translucent.Secondary};
          color: ${theme.Color.Content.Standard.Primary};
        `;
    }
  }}
`;

const EditorContent = styled.div`
  flex: 1;
  padding: ${theme.Component.Spacing[150]}px ${theme.Component.Spacing[400]}px;
  overflow: visible;
  position: relative;
  ${typo.Body.CodeRegular}
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  min-height: 400px;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  ${typo.Body.CodeRegular};
  color: ${theme.Color.Content.Standard.Primary};
  caret-color: ${theme.Color.Content.Standard.Primary};
  position: relative; /* Changed from absolute to relative */
  white-space: pre;
  overflow: auto;
  z-index: 2;
  padding: 0; /* Reset padding */
  font-family: monospace; /* Ensure consistent font */
`;

const OutputText = styled.pre`
  width: 100%;
  height: 100%;
  min-height: 400px;
  margin: 0;
  white-space: pre-wrap;
  ${typo.Body.CodeRegular};
  color: ${theme.Color.Content.Standard.Primary};
`;

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  isTask = true,
  onExecute,
  onReset,
  onSubmit,
  removeOutput,
  setOutput,
  output = '',
  solution = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [outputState, setOutputState] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleExecute = useCallback(async () => {
    setOutputState('');
    if (typeof setOutput === 'function') {
      setOutput('');
    }

    const updateLiveOutput = (text: string) => {
      setOutputState(text);
      if (typeof setOutput === 'function') {
        setOutput(text);
      }
    };

    await executeCode(code, updateLiveOutput);

    onExecute?.(code);
  }, [code, onExecute, setOutput]);

  const handleReset = () => {
    onReset?.();
    setCode(initialCode);
  };

  const handleSubmit = () => {
    const isCorrect = verifyCodeSolution(code, solution);

    if (isCorrect) {
      setShowSuccessPopup(true);

      const successOutput = '코드가 올바르게 작성되었습니다! 정답입니다.';

      if (typeof setOutput === 'function') {
        setOutput(successOutput);
      } else {
        setOutputState(successOutput);
      }
    } else {
      const failureOutput = '코드가 올바르지 않습니다. 다시 확인해 보세요.';

      if (typeof setOutput === 'function') {
        setOutput(failureOutput);
      } else {
        setOutputState(failureOutput);
      }
    }

    onSubmit?.(code);
  };

  const handleClearOutput = () => {
    setOutputState('');
    removeOutput?.();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <EditorContainer>
      <Section>
        <SectionHeader>
          <SectionTitle>입력</SectionTitle>
          <ButtonsContainer>
            <Button $variant='execute' onClick={handleExecute}>
              <Icon name='play_arrow' size={16} color={theme.Color.Core.Status.Positive} />
              실행
            </Button>
            <Button $variant='reset' onClick={handleReset}>
              <Icon name='replay' size={16} color={theme.Color.Core.Status.Negative} />
              초기화
            </Button>
            {isTask && (
              <Button $variant='submit' onClick={handleSubmit}>
                <Icon name='check' size={16} color={theme.Color.Content.Inverted.Primary} />
                제출
              </Button>
            )}
          </ButtonsContainer>
        </SectionHeader>
        <EditorContent>
          <StyledTextarea
            value={code}
            onChange={handleTextareaChange}
            spellCheck={false}
            placeholder='코드를 입력하세요...'
          />
        </EditorContent>
      </Section>
      <Section>
        <SectionHeader>
          <SectionTitle>출력</SectionTitle>
          <Button $variant='clear' onClick={handleClearOutput}>
            <Icon name='delete' size={16} color={theme.Color.Content.Standard.Primary} />
            출력창 정리하기
          </Button>
        </SectionHeader>
        <EditorContent>
          <OutputText>{output || outputState}</OutputText>
        </EditorContent>
      </Section>
      {showSuccessPopup && (
        <>
          <Overlay onClick={handleClosePopup} />
          <SuccessPopup>
            <SuccessIcon>
              <Icon name='check_circle' size={32} color='white' />
            </SuccessIcon>
            <SuccessTitle>성공!</SuccessTitle>
            <SuccessMessage>
              축하합니다! 코드가 올바르게 제출되었습니다.
              <br />
              다음 과제로 넘어가세요.
            </SuccessMessage>
            <CloseButton onClick={handleClosePopup}>닫기</CloseButton>
          </SuccessPopup>
        </>
      )}
    </EditorContainer>
  );
};

export default CodeEditor;
