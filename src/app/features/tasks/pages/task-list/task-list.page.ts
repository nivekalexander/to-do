import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonToast,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

import {
  AppHeaderComponent,
} from '../../../../core/layout/app-header/app-header.component';
import {
  BottomNavigationComponent,
} from '../../../../core/layout/bottom-navigation/bottom-navigation.component';
import {
  AppModalComponent,
} from '../../../../shared/components/app-modal/app-modal.component';
import {
  EmptyStateComponent,
} from '../../../../shared/components/empty-state/empty-state.component';
import {
  TaskFilters,
} from '../../../../shared/models/task-filter.model';
import {
  Task,
  TaskStatus,
} from '../../../../shared/models/task.model';
import {
  TaskActionsComponent,
} from '../../components/task-actions/task-actions.component';
import {
  TaskFilterComponent,
} from '../../components/task-filter/task-filter.component';
import {
  CreateTaskInput,
  TaskFormComponent,
} from '../../components/task-form/task-form.component';
import {
  TaskGroupComponent,
} from '../../components/task-group/task-group.component';
import {
  TaskSummaryComponent,
} from '../../components/task-summary/task-summary.component';
import {
  TasksFacade,
} from '../../data-access/tasks.facade';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    IonContent,
    IonFab,
    IonFabButton,
    IonFooter,
    IonHeader,
    IonIcon,
    IonSpinner,
    IonToast,
    IonToolbar,
    AppHeaderComponent,
    AppModalComponent,
    BottomNavigationComponent,
    EmptyStateComponent,
    TaskActionsComponent,
    TaskFilterComponent,
    TaskFormComponent,
    TaskGroupComponent,
    TaskSummaryComponent,
  ],
  templateUrl: './task-list.page.html',
  styleUrl: './task-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListPage implements OnInit {
  readonly facade = inject(TasksFacade);

  readonly selectedTask =
    signal<Task | null>(null);

  readonly taskFormOpen = signal(false);
  readonly toastOpen = signal(false);
  readonly toastMessage = signal('');

  readonly hasActiveFilters = computed(
    () => this.facade.activeFilterCount() > 0,
  );

  readonly hasFilteredTasks = computed(
    () => this.facade.filteredTasks().length > 0,
  );

  readonly showNotStartedGroup = computed(
    () =>
      !this.hasActiveFilters()
      || this.facade.notStartedTasks().length > 0,
  );

  readonly showInProgressGroup = computed(
    () =>
      !this.hasActiveFilters()
      || this.facade.inProgressTasks().length > 0,
  );

  readonly showFinishedGroup = computed(
    () =>
      !this.hasActiveFilters()
      || this.facade.finishedTasks().length > 0,
  );

  constructor() {
    addIcons({ add });
  }

  async ngOnInit(): Promise<void> {
    await this.facade.initialize();
  }

  openTaskForm(): void {
    this.taskFormOpen.set(true);
  }

  closeTaskForm(): void {
    this.taskFormOpen.set(false);
  }

  async createTask(
    input: CreateTaskInput,
  ): Promise<void> {
    try {
      await this.facade.addTask(
        input.title,
        input.categoryId,
      );

      this.closeTaskForm();
    } catch (error) {
      this.showError(error);
    }
  }

  setFilters(filters: TaskFilters): void {
    try {
      this.facade.setFilters(filters);
    } catch (error) {
      this.showError(error);
    }
  }

  openTaskActions(task: Task): void {
    this.selectedTask.set(task);
  }

  closeTaskActions(): void {
    this.selectedTask.set(null);
  }

  async moveSelectedTask(
    status: TaskStatus,
  ): Promise<void> {
    const task = this.selectedTask();

    if (!task) {
      return;
    }

    try {
      await this.facade.moveTask(
        task.id,
        status,
      );

      this.closeTaskActions();
    } catch (error) {
      this.showError(error);
    }
  }

  async deleteSelectedTask(): Promise<void> {
    const task = this.selectedTask();

    if (!task) {
      return;
    }

    try {
      await this.facade.deleteTask(task.id);
      this.closeTaskActions();
    } catch (error) {
      this.showError(error);
    }
  }

  private showError(error: unknown): void {
    this.toastMessage.set(
      error instanceof Error
        ? error.message
        : 'No fue posible completar la operacion.',
    );

    this.toastOpen.set(true);
  }
}
