export type TaskStatus =
  | 'not-started'
  | 'in-progress'
  | 'finished';

export interface Task {
  id: string;
  title: string;
  categoryId: string | null;
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
}
