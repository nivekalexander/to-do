import { TaskStatus } from './task.model';

export interface TaskFilters {
  categoryId: string | null;
  status: TaskStatus | null;
}

export const EMPTY_TASK_FILTERS: TaskFilters = {
  categoryId: null,
  status: null,
};
