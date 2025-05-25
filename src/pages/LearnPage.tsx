import { useState, useEffect, useCallback, useMemo } from 'react';
import { styled } from 'styled-components';
import { useRobotStore } from '@/store';
import { useSearchParams } from 'react-router-dom';
import theme from '@/styles/theme';
import LearnSidebar from '@/components/LearnSidebar/LearnSidebar';
import LessonContent from '@/components/LessonContent';
import CodeEditor from '@/components/CodeEditor';
import ProgressBreadcrumb, { type Step } from '@/components/ProgressBreadcrumb';

const LearnPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${theme.Color.Background.Standard.Primary};
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

function LearnPage() {
  const [searchParams] = useSearchParams();
  const robotIdFromUrl = searchParams.get('robotId');

  const {
    activeRobotId,
    activeLessonId,
    activeTaskId,
    fetchLessons,
    fetchTasks,
    setActiveRobot,
    setActiveLesson,
    setActiveTask,
    getActiveLesson,
    getActiveTask,
    getRobotLessons,
    getLessonTasks,
  } = useRobotStore();

  const [activeItemType, setActiveItemType] = useState<'lesson' | 'task'>('lesson');

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (robotIdFromUrl) {
      setActiveRobot(robotIdFromUrl);
    }
  }, [robotIdFromUrl, setActiveRobot]);

  useEffect(() => {
    if (activeRobotId) {
      fetchLessons(activeRobotId);
    }
  }, [activeRobotId, fetchLessons]);

  useEffect(() => {
    if (activeLessonId) {
      fetchTasks(activeLessonId);
    }
  }, [activeLessonId, fetchTasks]);

  useEffect(() => {
    if (!activeLessonId && !activeTaskId && activeRobotId) {
      const robotLessons = getRobotLessons(activeRobotId);
      if (robotLessons.length > 0) {
        setActiveLesson(robotLessons[0].id);
        setActiveItemType('lesson');
      }
    } else if (activeTaskId) {
      setActiveItemType('task');
    } else if (activeLessonId) {
      setActiveItemType('lesson');
    }
  }, [activeRobotId, activeLessonId, activeTaskId, getRobotLessons, setActiveLesson]);

  const handleLessonSelect = (lessonId: string) => {
    setActiveLesson(lessonId);
    setActiveItemType('lesson');
  };

  const handleTaskSelect = (taskId: string) => {
    setActiveTask(taskId);
    setActiveItemType('task');
  };

  const handleExecute = (executedCode: string) => {
    console.log('Executing code:', executedCode);
  };

  const handleReset = () => {
    if (activeTask) {
      const initialCode = extractInitialCode();
      console.log('Initial code:', initialCode);
      setCode(initialCode);
    }
  };

  const handleSubmit = (submittedCode: string) => {
    console.log('Submitting code:', submittedCode);
  };

  const robotLessons = useMemo(
    () => (activeRobotId ? getRobotLessons(activeRobotId) : []),
    [activeRobotId, getRobotLessons]
  );
  const lessonTasks = getLessonTasks(activeLessonId || '');
  const activeLesson = getActiveLesson();
  const activeTask = getActiveTask();

  const extractInitialCode = useCallback(() => {
    if (!activeTask) return '';

    const match = activeTask.content.match(/```python\n([\s\S]*?)```/);
    return match ? match[1].trim() : '';
  }, [activeTask]);

  useEffect(() => {
    if (activeTask) {
      setCode(extractInitialCode());
    }
  }, [activeTask, extractInitialCode]);

  useEffect(() => {
    if (activeTaskId) {
      setActiveItemType('task');
    }
  }, [activeTaskId]);

  const handleStepClick = (stepId: string) => {
    setActiveItemType('lesson');
    setActiveLesson(stepId);
  };

  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    if (robotLessons.length > 0) {
      setSteps(
        robotLessons.map((lesson, index) => ({
          id: lesson.id,
          key: lesson.id,
          title: lesson.content.split('\n')[0].replace('# ', ''),
          icon: 'school',
          isActive: activeLessonId === lesson.id,
          priority: index,
        }))
      );
    }
  }, [robotLessons, activeLessonId]);

  return (
    <LearnPageContainer>
      {steps.length > 0 && (
        <ProgressContainer>
          <ProgressBreadcrumb steps={steps} onStepClick={handleStepClick} />
        </ProgressContainer>
      )}

      <Container>
        <LearnSidebar
          menuItems={[
            {
              id: 'lessons',
              title: '강의 목록',
              items: robotLessons.map((lesson, index) => ({
                id: lesson.id,
                title: lesson.content.split('\n')[0].replace('# ', ''),
                type: 'lesson',
                priority: index,
              })),
            },
            {
              id: 'tasks',
              title: '과제 목록',
              items: lessonTasks.map((task, index) => ({
                id: task.id,
                title: task.content.split('\n')[0].replace('# ', ''),
                type: 'task',
                priority: robotLessons.length + index,
              })),
            },
          ]}
          activeItem={{
            activeItemId: activeItemType === 'lesson' ? activeLessonId || '' : activeTaskId || '',
            activeItemType,
          }}
          onItemSelect={(itemId, itemType) => {
            if (itemType === 'lesson') {
              handleLessonSelect(itemId);
            } else if (itemType === 'task') {
              handleTaskSelect(itemId);
            }
          }}
        />
        <ContentContainer>
          {activeItemType === 'lesson' && activeLesson && (
            <LessonContent
              markdown={activeLesson.content}
              title={activeLesson.content.split('\n')[0].replace('# ', '') || ''}
              hasTasks={lessonTasks.length > 0}
              onGoToTask={() => {
                if (lessonTasks.length > 0) {
                  handleTaskSelect(lessonTasks[0].id);
                }
              }}
            />
          )}
          {activeItemType === 'task' && activeTask && (
            <>
              <LessonContent
                markdown={activeTask.content}
                title={activeTask.content.split('\n')[0].replace('# ', '') || ''}
              />
            </>
          )}
          <CodeEditor
            initialCode={code}
            isTask={activeItemType === 'task'}
            onExecute={handleExecute}
            onReset={handleReset}
            onSubmit={handleSubmit}
            setOutput={setOutput}
            output={output}
            removeOutput={() => setOutput('')}
            solution={activeTask?.content.match(/```solution\n([\s\S]*?)```/)?.[1].trim() || ''}
          />
        </ContentContainer>
      </Container>
    </LearnPageContainer>
  );
}

export default LearnPage;
