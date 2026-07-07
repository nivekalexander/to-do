import {
  Category,
} from '../../models/category.model';
import {
  Task,
} from '../../models/task.model';
import {
  TodoState,
} from '../../models/todo-state.model';

export interface TodoRepository {
  load(): Promise<TodoState>;

  createTask(task: Task): Promise<void>;
  updateTask(task: Task): Promise<void>;
  deleteTask(taskId: string): Promise<void>;

  createCategory(
    category: Category,
  ): Promise<void>;

  updateCategory(
    category: Category,
  ): Promise<void>;

  deleteCategory(
    categoryId: string,
    tasksToUpdate: readonly Task[],
  ): Promise<void>;
}
