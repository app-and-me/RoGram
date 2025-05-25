export interface Robot {
  id: string;
  image: string;
  name: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  content: string;
  priority: number;
  robotId: string;
  robot?: Robot;
  tasks?: Task[];
}

export interface Task {
  id: string;
  content: string;
  priority: number;
  lessonId: string;
  lesson?: Lesson;
  submissions?: Submission[];
}

export interface Submission {
  id: string;
  content: string;
  taskId: string;
  task?: Task;
  createdAt?: Date;
}

export interface User {
  id: number;
  learning: string | null;
}
