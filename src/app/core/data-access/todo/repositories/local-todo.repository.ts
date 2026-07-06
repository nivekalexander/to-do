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

  async load(): Promise<TodoState> {
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
      return createInitialTodoState();
    }

    const migratedState =
      this.migrateStoredState(savedState);

    if (
      loadedLegacyState
      || savedState.version !== TODO_STATE_VERSION
    ) {
      await this.save(migratedState);
    }

    if (loadedLegacyState) {
      await this.storage.remove(
        LEGACY_STORAGE_KEY,
      );
    }

    return migratedState;
  }

  async save(state: TodoState): Promise<void> {
    await this.storage.set(
      STORAGE_KEY,
      state,
    );
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
