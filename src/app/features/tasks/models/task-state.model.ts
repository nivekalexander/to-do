import { Category } from './category.model';
import { Task } from './task.model';

export interface TaskState {
  version: 1;
  tasks: Task[];
  categories: Category[];
}

