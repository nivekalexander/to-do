import {
  inject,
  Injectable,
} from '@angular/core';

import {
  AppStorage,
} from '../../../storage/app-storage';
import {
  TodoRepository,
} from '../../../../shared/data-access/contracts/todo.repository';
import {
  Category,
} from '../../../../shared/models/category.model';
import {
  Task,
  TaskStatus,
} from '../../../../shared/models/task.model';
import {
  createInitialTodoState,
  TODO_STATE_VERSION,
  TodoState,
} from '../../../../shared/models/todo-state.model';

interface StoredTask {
  id: string;
  title: string;
  categoryId: string | null;
  completed?: boolean;
  status?: TaskStatus;
  createdAt: number;
  updatedAt: number;
}

interface StoredTodoState {
  version?: number;
  tasks?: StoredTask[];
  categories?: Category[];
}

const STORAGE_KEY = 'task-state';
const LEGACY_STORAGE_KEY = 'todo-state';

@Injectable()
export class LocalTodoRepository
  implements TodoRepository {

  private readonly storage = inject(AppStorage);

  private currentState:
    TodoState | null = null;

  async load(): Promise<TodoState> {
    if (this.currentState) {
      return structuredClone(this.currentState);
    }

    let savedState =
      await this.storage.get<StoredTodoState | null>(
        STORAGE_KEY,
        null,
      );

    let loadedLegacyState = false;

    if (!savedState) {
      savedState =
        await this.storage.get<StoredTodoState | null>(
          LEGACY_STORAGE_KEY,
          null,
        );

      loadedLegacyState = savedState !== null;
    }

    if (!this.isStoredStateValid(savedState)) {
      this.currentState =
        createInitialTodoState();

      return structuredClone(this.currentState);
    }

    this.currentState =
      this.migrateStoredState(savedState);

    if (
      loadedLegacyState
      || savedState.version !== TODO_STATE_VERSION
    ) {
      await this.persist(this.currentState);
    }

    if (loadedLegacyState) {
      await this.storage.remove(
        LEGACY_STORAGE_KEY,
      );
    }

    return structuredClone(this.currentState);
  }

  async createTask(task: Task): Promise<void> {
    await this.mutate(currentState => ({
      ...currentState,
      tasks: [
        task,
        ...currentState.tasks,
      ],
    }));
  }

  async updateTask(task: Task): Promise<void> {
    await this.mutate(currentState => ({
      ...currentState,
      tasks: currentState.tasks.map(
        currentTask =>
          currentTask.id === task.id
            ? task
            : currentTask,
      ),
    }));
  }

  async deleteTask(taskId: string):
    Promise<void> {

    await this.mutate(currentState => ({
      ...currentState,
      tasks: currentState.tasks.filter(
        task => task.id !== taskId,
      ),
    }));
  }

  async createCategory(
    category: Category,
  ): Promise<void> {
    await this.mutate(currentState => ({
      ...currentState,
      categories: [
        ...currentState.categories,
        category,
      ],
    }));
  }

  async updateCategory(
    category: Category,
  ): Promise<void> {
    await this.mutate(currentState => ({
      ...currentState,
      categories:
        currentState.categories.map(
          currentCategory =>
            currentCategory.id === category.id
              ? category
              : currentCategory,
        ),
    }));
  }

  async deleteCategory(
    categoryId: string,
    tasksToUpdate: readonly Task[],
  ): Promise<void> {
    const updatedTasksById =
      new Map(
        tasksToUpdate.map(task => [
          task.id,
          task,
        ]),
      );

    await this.mutate(currentState => ({
      ...currentState,
      categories:
        currentState.categories.filter(
          category =>
            category.id !== categoryId,
        ),
      tasks: currentState.tasks.map(
        task =>
          updatedTasksById.get(task.id)
          ?? task,
      ),
    }));
  }

  private async mutate(
    update: (
      currentState: TodoState,
    ) => TodoState,
  ): Promise<void> {
    const currentState = await this.load();
    const nextState = update(currentState);

    await this.persist(nextState);
  }

  private async persist(
    state: TodoState,
  ): Promise<void> {
    await this.storage.set(
      STORAGE_KEY,
      state,
    );

    this.currentState =
      structuredClone(state);
  }

  private migrateStoredState(
    savedState: StoredTodoState,
  ): TodoState {
    return {
      version: TODO_STATE_VERSION,
      tasks: (savedState.tasks ?? []).map(
        task => this.migrateTask(task),
      ),
      categories: savedState.categories ?? [],
    };
  }

  private migrateTask(
    storedTask: StoredTask,
  ): Task {
    const status =
      storedTask.status
      ?? (
        storedTask.completed
          ? 'finished'
          : 'not-started'
      );

    return {
      id: storedTask.id,
      title: storedTask.title,
      categoryId: storedTask.categoryId ?? null,
      status,
      createdAt: storedTask.createdAt,
      updatedAt: storedTask.updatedAt,
    };
  }

  private isStoredStateValid(
    savedState: StoredTodoState | null,
  ): savedState is StoredTodoState {
    return Boolean(
      savedState
      && Array.isArray(savedState.tasks)
      && Array.isArray(savedState.categories),
    );
  }
}
