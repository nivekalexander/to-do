import {
  computed,
  inject,
  Injectable,
  signal,
} from '@angular/core';

import { AppStorage } from '../../../core/storage/app-storage';
import { Category } from '../models/category.model';
import { Task } from '../models/task.model';
import { TaskState } from '../models/task-state.model';

type CategoryFilter = 'all' | 'uncategorized' | string;

const STORAGE_KEY = 'task-state';

function createInitialState(): TaskState {
  return {
    version: 1,
    tasks: [],
    categories: [],
  };
}

@Injectable({
  providedIn: 'root',
})
export class TaskStore {
  private readonly storage = inject(AppStorage);

  private readonly state = signal<TaskState>(createInitialState());
  private readonly categoryFilterState =
    signal<CategoryFilter>('all');
  private readonly loadingState = signal(false);
  private readonly initializedState = signal(false);

  readonly loading = this.loadingState.asReadonly();
  readonly initialized = this.initializedState.asReadonly();
  readonly categoryFilter =
    this.categoryFilterState.asReadonly();

  readonly tasks = computed(() => this.state().tasks);
  readonly categories = computed(() => this.state().categories);

  readonly filteredTasks = computed(() => {
    const filter = this.categoryFilterState();
    const tasks = this.state().tasks;

    if (filter === 'all') {
      return tasks;
    }

    if (filter === 'uncategorized') {
      return tasks.filter(task => task.categoryId === null);
    }

    return tasks.filter(task => task.categoryId === filter);
  });

  readonly pendingCount = computed(
    () => this.state().tasks.filter(task => !task.completed).length,
  );

  readonly completedCount = computed(
    () => this.state().tasks.filter(task => task.completed).length,
  );

  async initialize(): Promise<void> {
    if (this.initializedState() || this.loadingState()) {
      return;
    }

    this.loadingState.set(true);

    try {
      const storedState = await this.storage.get<TaskState| null>(
        STORAGE_KEY,
        null,
      );

      if (
        storedState?.version === 1 &&
        Array.isArray(storedState.tasks) &&
        Array.isArray(storedState.categories)
      ) {
        this.state.set(storedState);
      }

      this.initializedState.set(true);
    } finally {
      this.loadingState.set(false);
    }
  }

  async addTask(
    title: string,
    categoryId: string | null = null,
  ): Promise<void> {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      throw new Error('El tÃ­tulo es obligatorio.');
    }

    if (
      categoryId &&
      !this.state().categories.some(
        category => category.id === categoryId,
      )
    ) {
      throw new Error('La categorÃ­a seleccionada no existe.');
    }

    const now = Date.now();

    const task: Task = {
      id: this.createId(),
      title: normalizedTitle,
      completed: false,
      categoryId,
      createdAt: now,
      updatedAt: now,
    };

    await this.updateState(state => ({
      ...state,
      tasks: [task, ...state.tasks],
    }));
  }

  async toggleTask(taskId: string): Promise<void> {
    await this.updateState(state => ({
      ...state,
      tasks: state.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: Date.now(),
            }
          : task,
      ),
    }));
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.updateState(state => ({
      ...state,
      tasks: state.tasks.filter(task => task.id !== taskId),
    }));
  }

  async addCategory(name: string): Promise<void> {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new Error('El nombre es obligatorio.');
    }

    this.validateUniqueCategoryName(normalizedName);

    const now = Date.now();

    const category: Category = {
      id: this.createId(),
      name: normalizedName,
      createdAt: now,
      updatedAt: now,
    };

    await this.updateState(state => ({
      ...state,
      categories: [...state.categories, category],
    }));
  }

  async updateCategory(
    categoryId: string,
    name: string,
  ): Promise<void> {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new Error('El nombre es obligatorio.');
    }

    this.validateUniqueCategoryName(
      normalizedName,
      categoryId,
    );

    await this.updateState(state => ({
      ...state,
      categories: state.categories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              name: normalizedName,
              updatedAt: Date.now(),
            }
          : category,
      ),
    }));
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await this.updateState(state => ({
      ...state,
      categories: state.categories.filter(
        category => category.id !== categoryId,
      ),
      tasks: state.tasks.map(task =>
        task.categoryId === categoryId
          ? {
              ...task,
              categoryId: null,
              updatedAt: Date.now(),
            }
          : task,
      ),
    }));

    if (this.categoryFilterState() === categoryId) {
      this.categoryFilterState.set('all');
    }
  }

  setCategoryFilter(filter: CategoryFilter): void {
    this.categoryFilterState.set(filter);
  }

  private async updateState(
    updater: (state: TaskState) => TaskState,
  ): Promise<void> {
    const nextState = updater(this.state());

    this.state.set(nextState);
    await this.storage.set(STORAGE_KEY, nextState);
  }

  private validateUniqueCategoryName(
    name: string,
    ignoredCategoryId?: string,
  ): void {
    const normalizedName = name.toLocaleLowerCase();

    const duplicated = this.state().categories.some(
      category =>
        category.id !== ignoredCategoryId &&
        category.name.toLocaleLowerCase() === normalizedName,
    );

    if (duplicated) {
      throw new Error('Ya existe una categorÃ­a con ese nombre.');
    }
  }

  private createId(): string {
    return globalThis.crypto?.randomUUID?.()
      ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

