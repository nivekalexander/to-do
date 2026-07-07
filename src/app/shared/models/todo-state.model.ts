import { Category } from './category.model';
import { Task } from './task.model';

export const TODO_STATE_VERSION = 2 as const;

export interface TodoState {
  version: typeof TODO_STATE_VERSION;
  tasks: Task[];
  categories: Category[];
}

export function createInitialTodoState(): TodoState {
  return {
    version: TODO_STATE_VERSION,
    tasks: [],
    categories: [],
  };
}
