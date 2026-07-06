import {
  inject,
  Injectable,
} from '@angular/core';

import {
  TodoStore,
} from '../../../shared/data-access/todo-store';
import {
  TaskFilters,
} from '../../../shared/models/task-filter.model';
import {
  TaskStatus,
} from '../../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksFacade {
  private readonly store = inject(TodoStore);

  readonly loading = this.store.loading;
  readonly categories = this.store.categories;
  readonly filters = this.store.filters;
  readonly activeFilterCount =
    this.store.activeFilterCount;
  readonly filteredTasks = this.store.filteredTasks;
  readonly notStartedTasks =
    this.store.notStartedTasks;
  readonly inProgressTasks =
    this.store.inProgressTasks;
  readonly finishedTasks = this.store.finishedTasks;
  readonly pendingCount = this.store.pendingCount;
  readonly completedCount = this.store.completedCount;

  initialize(): Promise<void> {
    return this.store.initialize();
  }

  addTask(
    title: string,
    categoryId: string | null,
  ): Promise<void> {
    return this.store.addTask(title, categoryId);
  }

  moveTask(
    taskId: string,
    status: TaskStatus,
  ): Promise<void> {
    return this.store.moveTask(taskId, status);
  }

  deleteTask(taskId: string): Promise<void> {
    return this.store.deleteTask(taskId);
  }

  setFilters(filters: TaskFilters): void {
    this.store.setFilters(filters);
  }

  clearFilters(): void {
    this.store.clearFilters();
  }
}
