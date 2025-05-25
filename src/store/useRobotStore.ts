import { create } from 'zustand';
import type { Lesson, Robot, Submission, Task } from './types';

interface RobotState {
  robots: Robot[];
  lessons: Lesson[];
  tasks: Task[];
  submissions: Submission[];

  activeRobotId: string | null;
  activeLessonId: string | null;
  activeTaskId: string | null;

  fetchRobots: () => Promise<void>;
  addRobot: (robot: Omit<Robot, 'id' | 'lessons'>) => Promise<void>;
  updateRobot: (id: string, robotData: Partial<Robot>) => Promise<void>;
  deleteRobot: (id: string) => Promise<void>;
  setActiveRobot: (id: string | null) => void;

  fetchLessons: (robotId?: string) => Promise<void>;
  addLesson: (lesson: Omit<Lesson, 'id'>) => Promise<void>;
  updateLesson: (id: string, lessonData: Partial<Lesson>) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  setActiveLesson: (id: string | null) => void;

  fetchTasks: (lessonId?: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'submissions'>) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setActiveTask: (id: string | null) => void;

  fetchSubmissions: (taskId?: string) => Promise<void>;
  addSubmission: (submission: Omit<Submission, 'id'>) => Promise<void>;
  updateSubmission: (id: string, submissionData: Partial<Submission>) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;

  getActiveRobot: () => Robot | undefined;
  getActiveLesson: () => Lesson | undefined;
  getActiveTask: () => Task | undefined;
  getRobotLessons: (robotId: string) => Lesson[];
  getLessonTasks: (lessonId: string) => Task[];
  getTaskSubmissions: (taskId: string) => Submission[];
}

const mockRobots: Robot[] = [
  {
    id: '1',
    name: '창문 자동 개폐 로봇',
    image: '/images/robot1.png',
  },
];

const mockLessons: Lesson[] = [
  {
    id: '1',
    content:
      '# 파이썬 기초 문법\n## 변수와 조건문\n파이썬에서 변수는 값을 저장하는 공간입니다.\n```python\ntemp = 23.5\n```\n\n조건문은 특정 조건이 참일 때만 실행됩니다.\n```python\nif temp >= 22.5:\n print("더움")\n```\n\n## while 반복문\nwhile문은 조건이 True일 동안 계속 실행됩니다.\n```python\nwhile not done:\n print("계속 반복")\n```\n\n## 삼항 연산자 (조건식)\n한 줄로 조건에 따라 값을 결정할 수 있습니다.\n```python\nresult = "Yes" if temp > 20 else "No"\n```',
    priority: 1,
    robotId: '1',
  },
  {
    id: '2',
    content:
      '# 함수, 객체, 모듈과 클래스\n## 함수 호출\n함수는 특정 작업을 수행하는 코드 블록입니다.\n```python\nprint("Hello")\n```\n\n## 객체의 메서드\n객체의 기능은 메서드를 통해 사용합니다.\n```python\npingpong.start()\npingpong.get_current_temperature(1)\n```\n\n## 모듈 임포트\n다른 파일에 있는 기능을 사용하려면 import를 사용합니다.\n```python\nfrom pingpong import PingPongThread\n```\n\n## 클래스 사용\n클래스는 객체를 만들기 위한 틀입니다.\n```python\npingpong = PingPongThread(number=1, group_id=4)\n```',
    priority: 2,
    robotId: '1',
  },
  {
    id: '3',
    content:
      '# 로봇 연결과 종료\n## 연결 시작\n```python\npingpong.start()\n```로 연결을 시작하고\n```python\npingpong.wait_until_full_connect()\n```로 연결 완료를 기다립니다.\n\n## 연결 종료\n작업이 끝나면```python\npingpong.stop_sensor_data(1)\n```로 센서 종료 후\n```python\npingpong.end()\n```로 연결을 완전히 종료합니다.',
    priority: 3,
    robotId: '1',
  },
  {
    id: '4',
    content:
      '# 센서 제어와 키보드 입력\n## 센서 데이터 수신\n```python\npingpong.receive_sensor_data(cube_ID, method="periodic", period=0.5)\n```\n\n## 실시간 키보드 입력\n```python\nkeyboard.is_pressed("q")\n```\n로 키 입력 감지\n(주의: keyboard 모듈은 관리자 권한 필요할 수 있음)\n\n## 센서 수신 종료\n```python\npingpong.stop_sensor_data(cube_ID)\n```',
    priority: 4,
    robotId: '1',
  },
  {
    id: '5',
    content:
      '# 모터 제어와 온도 로직\n## run_motor_step 함수\n```python\n# 회전량 = (520/360) * 회전 각도\nrun_motor_step(cube_id, 속도, 회전량)\n```\n\n## 회전 시간 계산\n시간 = 회전량 / 속도 * 60\n```python\n(520/360)/30*60\n```\n\n## 온도에 따른 상태 전환\n온도가 22.5도 이상이면 상태를 True로,\n19도 이하로 떨어지면 False로 전환\n\n## 한 줄 조건식으로 상태 전환\n```python\nabove_threshold = temp >= 22.5 if not above_threshold and temp >= 22.5 else temp <= 19 if above_threshold and temp <= 19 else above_threshold\n```',
    priority: 5,
    robotId: '1',
  },
  {
    id: '6',
    content:
      '# 창문 자동 개폐 장치 만들기\n\n## 로직 설명\n\n온도에 따라 창문을 여닫는 장치를 구현합니다.\n\n- `PingPongThread` 로봇을 시작하고 연결을 기다립니다.\n- 주기적으로 온도를 측정합니다.\n- 온도가 **22.5도 이상**일 경우 창문을 엽니다 (모터 반시계 회전)\n- 온도가 **19도 이하**일 경우 창문을 닫습니다 (모터 시계 회전)\n- 버튼이 눌릴 때까지 계속 반복합니다.\n\n## 주요 개념\n- 센서 데이터 수신\n- 삼항 연산자\n- 조건에 따른 상태 변경 및 모터 제어\n\n```python\nfrom pingpong import PingPongThread\nimport time\nimport keyboard\n\npingpong = PingPongThread(number=1, group_id=4)\npingpong.start()\npingpong.wait_until_full_connect()\n\ncube_ID = 1\npingpong.receive_sensor_data(cube_ID=cube_ID, method="periodic", period=0.5)\n\nabove_threshold = False\n\nwhile not pingpong.get_current_button(cube_ID) == 1:\n    temp = pingpong.get_current_temperature(cube_ID)\n    print("Temperature:", temp)\n\n    above_threshold = temp >= 22.5 if not above_threshold and temp >= 22.5 else temp <= 19 if above_threshold and temp <= 19 else above_threshold\n    rotation_direction = -1 if above_threshold != (temp <= 19) and temp >= 22.5 else 1 if above_threshold != (temp >= 22.5) and temp <= 19 else 0\n\n    pingpong.run_motor_step(1, 30, (520/360) * rotation_direction) if rotation_direction != 0 else None\n    time.sleep((520/360)/30*60) if rotation_direction != 0 else None\n\n    time.sleep(0.5)\n\npingpong.stop_sensor_data(cube_ID)\npingpong.end()\n```',
    priority: 6,
    robotId: '1',
  },
  {
    id: '7',
    content: '# 레고 로봇 만들기',
    priority: 7,
    robotId: '1',
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    content:
      '# 변수 실습\n\n## 과제 설명\n1. 현재 온도를 저장하는 변수 `temp`를 만들고, 초기값을 `23.5`로 설정하세요.\n2. `temp`의 값을 출력하세요.\n\n## 평가 기준\n- 변수 선언과 초기화가 정확한가?\n- 출력 결과가 예상대로 나오는가?',
    priority: 1,
    lessonId: '1',
  },
  {
    id: '2',
    content:
      '# 조건문 실습\n\n## 과제 설명\n1. `temp >= 22.5`일 경우 "더움"을 출력하고, 아니면 "괜찮음"을 출력하는 조건문을 작성하세요.\n\n## 평가 기준\n- 조건문이 올바르게 작성되었는가?\n- 출력 결과가 조건에 따라 정확한가?',
    priority: 2,
    lessonId: '1',
  },
  {
    id: '3',
    content:
      '# 반복문 실습\n\n## 과제 설명\n1. `done`이 `False`인 동안 "반복 중"을 출력하는 while문을 작성하세요.\n2. 반복문이 한 번만 실행되도록 `done = True`로 설정하세요.\n\n## 평가 기준\n- while문이 올바르게 작성되었는가?\n- 반복 조건과 종료 조건이 정확한가?',
    priority: 3,
    lessonId: '1',
  },
  {
    id: '4',
    content:
      '# 삼항 연산자 실습\n\n## 과제 설명\n1. `temp`의 값이 20보다 크면 "Yes", 아니면 "No"를 출력하는 삼항 연산자를 사용하세요.\n\n## 평가 기준\n- 삼항 연산자가 올바르게 사용되었는가?\n- 출력 결과가 조건에 따라 정확한가?',
    priority: 4,
    lessonId: '1',
  },
  {
    id: '5',
    content:
      '# 함수 정의 및 호출 실습\n\n## 과제 설명\n1. `print_hello()` 함수를 정의하여 "Hello"를 출력하게 하세요.\n2. 정의한 함수를 호출하세요.\n\n## 평가 기준\n- 함수 정의와 호출이 정확한가?\n- 출력 결과가 예상대로 나오는가?',
    priority: 1,
    lessonId: '2',
  },
  {
    id: '6',
    content:
      '# 객체의 메서드 사용 실습\n\n## 과제 설명\n1. `pingpong` 객체를 생성하고, `start()` 메서드를 호출하세요.\n2. `get_current_temperature(1)` 메서드를 호출하여 결과를 출력하세요.\n\n## 평가 기준\n- 객체 생성과 메서드 호출이 정확한가?\n- 출력 결과가 예상대로 나오는가?',
    priority: 2,
    lessonId: '2',
  },
  {
    id: '7',
    content:
      '# 모듈 임포트 실습\n\n## 과제 설명\n1. `pingpong` 모듈에서 `PingPongThread` 클래스를 임포트하세요.\n\n## 평가 기준\n- import 문이 올바르게 작성되었는가?\n- 필요한 클래스가 정확히 임포트되었는가?',
    priority: 3,
    lessonId: '2',
  },
  {
    id: '8',
    content:
      '# 클래스 사용 실습\n\n## 과제 설명\n1. `PingPongThread` 클래스를 사용하여 `pingpong` 객체를 생성하세요. 생성 시 `number=1`, `group_id=4`를 설정하세요.\n\n## 평가 기준\n- 클래스 인스턴스 생성이 정확한가?\n- 생성자 인자 설정이 올바른가?',
    priority: 4,
    lessonId: '2',
  },
  {
    id: '9',
    content:
      '# 로봇 연결 시작 실습\n\n## 과제 설명\n1. `pingpong.start()`를 호출하여 로봇 연결을 시작하세요.\n2. `pingpong.wait_until_full_connect()`를 사용하여 연결 완료를 기다리세요.\n\n## 평가 기준\n- 연결 시작과 대기 메서드 호출이 정확한가?\n- 코드 실행 순서가 올바른가?',
    priority: 1,
    lessonId: '3',
  },
  {
    id: '10',
    content:
      '# 로봇 연결 종료 실습\n\n## 과제 설명\n1. `pingpong.stop_sensor_data(1)`를 호출하여 센서 데이터를 중지하세요.\n2. `pingpong.end()`를 호출하여 로봇 연결을 종료하세요.\n\n## 평가 기준\n- 센서 데이터 중지와 연결 종료 메서드 호출이 정확한가?\n- 코드 실행 순서가 올바른가?',
    priority: 2,
    lessonId: '3',
  },
  {
    id: '11',
    content:
      '# 센서 데이터 수신 실습\n\n## 과제 설명\n1. `pingpong.receive_sensor_data(cube_ID, method="periodic", period=0.5)`를 사용하여 센서 데이터를 주기적으로 수신하세요.\n\n## 평가 기준\n- 센서 데이터 수신 메서드 호출이 정확한가?\n- 인자 설정이 올바른가?',
    priority: 1,
    lessonId: '4',
  },
  {
    id: '12',
    content:
      '# 키보드 입력 감지 실습\n\n## 과제 설명\n1. `keyboard.is_pressed("q")`를 사용하여 "q" 키 입력을 감지하는 코드를 작성하세요.\n\n## 평가 기준\n- 키보드 입력 감지 코드가 정확한가?\n- 조건문과 함께 사용하여 입력을 처리했는가?',
    priority: 2,
    lessonId: '4',
  },
  {
    id: '13',
    content:
      '# 센서 수신 종료 실습\n\n## 과제 설명\n1. `pingpong.stop_sensor_data(cube_ID)`를 호출하여 센서 데이터 수신을 종료하세요.\n\n## 평가 기준\n- 센서 데이터 수신 종료 메서드 호출이 정확한가?\n- 인자 설정이 올바른가?',
    priority: 3,
    lessonId: '4',
  },
  {
    id: '14',
    content:
      '# 모터 제어 실습\n\n## 과제 설명\n1. `run_motor_step(cube_id, 속도, 회전량)` 함수를 사용하여 모터를 제어하세요.\n2. 회전량은 `(520/360) * 회전 각도`로 계산하세요.\n\n## 평가 기준\n- 모터 제어 함수 호출이 정확한가?\n- 회전량 계산이 올바른가?',
    priority: 1,
    lessonId: '5',
  },
  {
    id: '15',
    content:
      '# 회전 시간 계산 실습\n\n## 과제 설명\n1. 회전 시간은 `시간 = 회전량 / 속도 * 60` 공식을 사용하여 계산하세요.\n2. 계산된 시간을 `time.sleep()` 함수에 적용하세요.\n\n## 평가 기준\n- 회전 시간 계산이 정확한가?\n- `time.sleep()` 함수 사용이 올바른가?',
    priority: 2,
    lessonId: '5',
  },
  {
    id: '16',
    content:
      '# 온도에 따른 상태 전환 실습\n\n## 과제 설명\n1. 온도가 22.5도 이상이면 상태를 `True`로, 19도 이하로 떨어지면 `False`로 전환하는 로직을 작성하세요.\n\n## 평가 기준\n- 조건문이 정확하게 작성되었는가?\n- 상태 전환 로직이 올바른가?',
    priority: 3,
    lessonId: '5',
  },
  {
    id: '17',
    content:
      '# 삼항 연산자를 이용한 상태 전환 실습\n\n## 과제 설명\n1. 한 줄의 삼항 연산자를 사용하여 온도에 따른 상태 전환 로직을 작성하세요.\n\n## 평가 기준\n- 삼항 연산자 사용이 정확한가?\n- 상태 전환 로직이 올바른가?',
    priority: 4,
    lessonId: '5',
  },
];

const mockSubmissions: Submission[] = [
  {
    id: '1',
    content:
      'def add_numbers(a, b):\n    return a + b\n\nresult = add_numbers(10, 20)\nprint(result)',
    taskId: '1',
    createdAt: new Date(),
  },
];

const useRobotStore = create<RobotState>((set, get) => ({
  robots: mockRobots,
  lessons: mockLessons,
  tasks: mockTasks,
  submissions: mockSubmissions,
  activeRobotId: '1',
  activeLessonId: null,
  activeTaskId: null,

  fetchRobots: async () => {
    try {
      set({ robots: mockRobots });
    } catch (error) {
      console.error('Failed to fetch robots:', error);
    }
  },

  addRobot: async (robot) => {
    try {
      const newRobot: Robot = {
        ...robot,
        id: Date.now().toString(),
      };
      set((state) => ({
        robots: [...state.robots, newRobot],
      }));
    } catch (error) {
      console.error('Failed to add robot:', error);
    }
  },

  updateRobot: async (id, robotData) => {
    try {
      set((state) => ({
        robots: state.robots.map((robot) => (robot.id === id ? { ...robot, ...robotData } : robot)),
      }));
    } catch (error) {
      console.error(`Failed to update robot ${id}:`, error);
    }
  },

  deleteRobot: async (id) => {
    try {
      set((state) => ({
        robots: state.robots.filter((robot) => robot.id !== id),
        activeRobotId: state.activeRobotId === id ? null : state.activeRobotId,
      }));
    } catch (error) {
      console.error(`Failed to delete robot ${id}:`, error);
    }
  },

  setActiveRobot: (id) => set({ activeRobotId: id }),

  fetchLessons: async (robotId) => {
    try {
      const filteredLessons = robotId
        ? mockLessons.filter((lesson) => lesson.robotId === robotId)
        : mockLessons;

      set({ lessons: filteredLessons });
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    }
  },

  addLesson: async (lesson) => {
    try {
      const newLesson: Lesson = {
        ...lesson,
        id: Date.now().toString(),
      };

      set((state) => ({
        lessons: [...state.lessons, newLesson],
      }));
    } catch (error) {
      console.error('Failed to add lesson:', error);
    }
  },

  updateLesson: async (id, lessonData) => {
    try {
      set((state) => ({
        lessons: state.lessons.map((lesson) =>
          lesson.id === id ? { ...lesson, ...lessonData } : lesson
        ),
      }));
    } catch (error) {
      console.error(`Failed to update lesson ${id}:`, error);
    }
  },

  deleteLesson: async (id) => {
    try {
      set((state) => ({
        lessons: state.lessons.filter((lesson) => lesson.id !== id),
        activeLessonId: state.activeLessonId === id ? null : state.activeLessonId,
      }));
    } catch (error) {
      console.error(`Failed to delete lesson ${id}:`, error);
    }
  },

  setActiveLesson: (id) => {
    if (id) {
      set({
        activeLessonId: id,
        activeTaskId: null,
      });
    } else {
      set({ activeLessonId: null });
    }
  },

  fetchTasks: async (lessonId?: string) => {
    try {
      const filteredTasks = lessonId
        ? mockTasks.filter((task) => task.lessonId === lessonId)
        : mockTasks;

      set({ tasks: filteredTasks });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  },

  addTask: async (task) => {
    try {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
      };

      set((state) => ({
        tasks: [...state.tasks, newTask],
      }));
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  },

  updateTask: async (id, taskData) => {
    try {
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...taskData } : task)),
      }));
    } catch (error) {
      console.error(`Failed to update task ${id}:`, error);
    }
  },

  deleteTask: async (id) => {
    try {
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
      }));
    } catch (error) {
      console.error(`Failed to delete task ${id}:`, error);
    }
  },

  setActiveTask: (id) => {
    if (id) {
      const task = get().tasks.find((task) => task.id === id);
      set({
        activeTaskId: id,
        activeLessonId: task?.lessonId || get().activeLessonId,
      });
    } else {
      set({ activeTaskId: null });
    }
  },

  fetchSubmissions: async (taskId) => {
    try {
      const filteredSubmissions = taskId
        ? mockSubmissions.filter((submission) => submission.taskId === taskId)
        : mockSubmissions;

      set({ submissions: filteredSubmissions });
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  },

  addSubmission: async (submission) => {
    try {
      const newSubmission: Submission = {
        ...submission,
        id: Date.now().toString(),
        createdAt: new Date(),
      };

      set((state) => ({
        submissions: [...state.submissions, newSubmission],
      }));
    } catch (error) {
      console.error('Failed to add submission:', error);
    }
  },

  updateSubmission: async (id, submissionData) => {
    try {
      set((state) => ({
        submissions: state.submissions.map((submission) =>
          submission.id === id ? { ...submission, ...submissionData } : submission
        ),
      }));
    } catch (error) {
      console.error(`Failed to update submission ${id}:`, error);
    }
  },

  deleteSubmission: async (id) => {
    try {
      set((state) => ({
        submissions: state.submissions.filter((submission) => submission.id !== id),
      }));
    } catch (error) {
      console.error(`Failed to delete submission ${id}:`, error);
    }
  },

  getActiveRobot: () => {
    const state = get();
    return state.robots.find((robot) => robot.id === state.activeRobotId);
  },

  getActiveLesson: () => {
    const state = get();
    return state.lessons.find((lesson) => lesson.id === state.activeLessonId);
  },

  getActiveTask: () => {
    const state = get();
    return state.tasks.find((task) => task.id === state.activeTaskId);
  },

  getRobotLessons: (robotId) => {
    return get()
      .lessons.filter((lesson) => lesson.robotId === robotId)
      .sort((a, b) => a.priority - b.priority);
  },

  getLessonTasks: (lessonId: string) => {
    return get()
      .tasks.filter((task) => task.lessonId === lessonId)
      .sort((a, b) => a.priority - b.priority);
  },

  getTaskSubmissions: (taskId) => {
    return get()
      .submissions.filter((submission) => submission.taskId === taskId)
      .sort((a, b) =>
        a.createdAt && b.createdAt ? b.createdAt.getTime() - a.createdAt.getTime() : 0
      );
  },
}));

export default useRobotStore;
