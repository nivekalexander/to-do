import {
  computed,
  inject,
  Injectable,
  signal,
} from '@angular/core';

import {
  Category,
} from '../models/category.model';
import {
  EMPTY_TASK_FILTERS,
  TaskFilters,
} from '../models/task-filter.model';
import {
  Task,
  TaskStatus,
} from '../models/task.model';
import {
  createInitialTodoState,
  TodoState,
} from '../models/todo-state.model';
import {
  TODO_REPOSITORY,
} from './todo-repository.token';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  private readonly repository =
    inject(TODO_REPOSITORY);

  private readonly state = signal<TodoState>(
    createInitialTodoState(),
  );

  private readonly loadingState = signal(false);
  private readonly initializedState = signal(false);
  private readonly filtersState = signal<TaskFilters>({
    ...EMPTY_TASK_FILTERS,
  });

  readonly loading = this.loadingState.asReadonly();
  readonly initialized = this.initializedState.asReadonly();
  readonly filters = this.filtersState.asReadonly();

  readonly tasks = computed(() => this.state().tasks);

  readonly categories = computed(
    () => this.state().categories,
  );

  readonly activeFilterCount = computed(() => {
    const filters = this.filtersState();

    return Number(filters.categoryId !== null)
      + Number(filters.status !== null);
  });

  readonly filteredTasks = computed(() => {
    const filters = this.filtersState();

    return this.state().tasks.filter(task => {
      const matchesCategory =
        filters.categoryId === null
        || task.categoryId === filters.categoryId;

      const matchesStatus =
        filters.status === null
        || task.status === filters.status;

      return matchesCategory && matchesStatus;
    });
  });

  readonly notStartedTasks = computed(() =>
    this.filteredTasks().filter(
      task => task.status === 'not-started',
    ),
  );

  readonly inProgressTasks = computed(() =>
    this.filteredTasks().filter(
      task => task.status === 'in-progress',
    ),
  );

  readonly finishedTasks = computed(() =>
    this.filteredTasks().filter(
      task => task.status === 'finished',
    ),
  );

  readonly pendingCount = computed(
    () =>
      this.state().tasks.filter(
        task => task.status !== 'finished',
      ).length,
  );

  readonly completedCount = computed(
    () =>
      this.state().tasks.filter(
        task => task.status === 'finished',
      ).length,
  );

  async initialize(): Promise<void> {
    if (
      this.initializedState()
      || this.loadingState()
    ) {
      return;
    }

    this.loadingState.set(true);

    try {
      const savedState =
        await this.repository.load();

      this.state.set(savedState);
    } finally {
      this.initializedState.set(true);
      this.loadingState.set(false);
    }
  }

  async addTask(
    title: string,
    categoryId: string | null = null,
  ): Promise<void> {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      throw new Error(
        'El titulo es obligatorio.',
      );
    }

    this.validateCategory(categoryId);

    const now = Date.now();

    const task: Task = {
      id: this.createId(),
      title: cleanTitle,
      categoryId,
      status: 'not-started',
      createdAt: now,
      updatedAt: now,
    };

    await this.updateState(currentState => ({
      ...currentState,
      tasks: [
        task,
        ...currentState.tasks,
      ],
    }));
  }

  async moveTask(
    taskId: string,
    status: TaskStatus,
  ): Promise<void> {
    this.validateStatus(status);

    const task = this.state().tasks.find(
      currentTask => currentTask.id === taskId,
    );

    if (!task) {
      throw new Error(
        'La tarea seleccionada no existe.',
      );
    }

    if (task.status === status) {
      return;
    }

    await this.updateState(currentState => ({
      ...currentState,
      tasks: currentState.tasks.map(currentTask =>
        currentTask.id === taskId
          ? {
              ...currentTask,
              status,
              updatedAt: Date.now(),
            }
          : currentTask,
      ),
    }));
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskExists = this.state().tasks.some(
      task => task.id === taskId,
    );

    if (!taskExists) {
      return;
    }

    await this.updateState(currentState => ({
      ...currentState,
      tasks: currentState.tasks.filter(
        task => task.id !== taskId,
      ),
    }));
  }

  async addCategory(name: string): Promise<void> {
    const cleanName = name.trim();

    if (!cleanName) {
      throw new Error(
        'El nombre es obligatorio.',
      );
    }

    this.validateUniqueCategoryName(cleanName);

    const now = Date.now();

    const category: Category = {
      id: this.createId(),
      name: cleanName,
      createdAt: now,
      updatedAt: now,
    };

    await this.updateState(currentState => ({
      ...currentState,
      categories: [
        ...currentState.categories,
        category,
      ],
    }));
  }

  async updateCategory(
    categoryId: string,
    name: string,
  ): Promise<void> {
    const cleanName = name.trim();

    if (!cleanName) {
      throw new Error(
        'El nombre es obligatorio.',
      );
    }

    const categoryExists =
      this.state().categories.some(
        category => category.id === categoryId,
      );

    if (!categoryExists) {
      throw new Error(
        'La categoria seleccionada no existe.',
      );
    }

    this.validateUniqueCategoryName(
      cleanName,
      categoryId,
    );

    await this.updateState(currentState => ({
      ...currentState,
      categories: currentState.categories.map(
        category =>
          category.id === categoryId
            ? {
                ...category,
                name: cleanName,
                updatedAt: Date.now(),
              }
            : category,
      ),
    }));
  }

  async deleteCategory(
    categoryId: string,
  ): Promise<void> {
    const categoryExists =
      this.state().categories.some(
        category => category.id === categoryId,
      );

    if (!categoryExists) {
      return;
    }

    const now = Date.now();

    await this.updateState(currentState => ({
      ...currentState,
      categories:
        currentState.categories.filter(
          category => category.id !== categoryId,
        ),
      tasks: currentState.tasks.map(task =>
        task.categoryId === categoryId
          ? {
              ...task,
              categoryId: null,
              updatedAt: now,
            }
          : task,
      ),
    }));

    if (
      this.filtersState().categoryId === categoryId
    ) {
      this.clearFilters();
    }
  }

  setFilters(filters: TaskFilters): void {
    this.validateCategory(filters.categoryId);

    if (filters.status !== null) {
      this.validateStatus(filters.status);
    }

    this.filtersState.set({
      categoryId: filters.categoryId,
      status: filters.status,
    });
  }

  clearFilters(): void {
    this.filtersState.set({
      ...EMPTY_TASK_FILTERS,
    });
  }

  private async updateState(
    update: (
      currentState: TodoState,
    ) => TodoState,
  ): Promise<void> {
    const nextState = update(this.state());

    await this.repository.save(nextState);
    this.state.set(nextState);
  }

  private validateCategory(
    categoryId: string | null,
  ): void {
    if (categoryId === null) {
      return;
    }

    const categoryExists =
      this.state().categories.some(
        category => category.id === categoryId,
      );

    if (!categoryExists) {
      throw new Error(
        'La categoria seleccionada no existe.',
      );
    }
  }

  private validateUniqueCategoryName(
    name: string,
    ignoredCategoryId?: string,
  ): void {
    const normalizedName =
      name.toLocaleLowerCase();

    const duplicated =
      this.state().categories.some(
        category =>
          category.id !== ignoredCategoryId
          && category.name
            .trim()
            .toLocaleLowerCase() === normalizedName,
      );

    if (duplicated) {
      throw new Error(
        'Ya existe una categoria con ese nombre.',
      );
    }
  }

  private validateStatus(
    status: TaskStatus,
  ): void {
    const allowedStatuses: TaskStatus[] = [
      'not-started',
      'in-progress',
      'finished',
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error(
        'El estado seleccionado no es valido.',
      );
    }
  }

  private createId(): string {
    return (
      globalThis.crypto?.randomUUID?.()
      ?? `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`
    );
  }
}
