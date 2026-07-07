import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmark,
  optionsOutline,
} from 'ionicons/icons';

import {
  AppModalComponent,
} from '../../../../shared/components/app-modal/app-modal.component';
import {
  Category,
} from '../../../../shared/models/category.model';
import {
  TaskFilters,
} from '../../../../shared/models/task-filter.model';
import {
  TaskStatus,
} from '../../../../shared/models/task.model';

type StatusSelection = TaskStatus | 'all';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    AppModalComponent,
  ],
  templateUrl: './task-filter.component.html',
  styleUrl: './task-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFilterComponent {
  readonly categories =
    input<readonly Category[]>([]);

  readonly filters =
    input.required<TaskFilters>();

  readonly filterChanged =
    output<TaskFilters>();

  readonly filtersCleared = output<void>();

  readonly open = signal(false);
  readonly selectedCategoryId =
    signal<string | null>(null);

  readonly selectedStatus =
    signal<StatusSelection>('all');

  readonly statusOptions: readonly {
    value: StatusSelection;
    label: string;
  }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'not-started', label: 'No iniciado' },
    { value: 'in-progress', label: 'En progreso' },
    { value: 'finished', label: 'Terminado' },
  ];

  readonly activeCount = computed(() => {
    const filters = this.filters();

    return Number(filters.categoryId !== null)
      + Number(filters.status !== null);
  });

  constructor() {
    addIcons({
      checkmark,
      optionsOutline,
    });
  }

  openFilters(): void {
    const filters = this.filters();

    this.selectedCategoryId.set(
      filters.categoryId,
    );

    this.selectedStatus.set(
      filters.status ?? 'all',
    );

    this.open.set(true);
  }

  closeFilters(): void {
    this.open.set(false);
  }

  selectCategory(
    categoryId: string | null,
  ): void {
    this.selectedCategoryId.set(categoryId);
  }

  selectStatus(
    status: StatusSelection,
  ): void {
    this.selectedStatus.set(status);
  }

  applyFilters(): void {
    this.filterChanged.emit({
      categoryId: this.selectedCategoryId(),
      status:
        this.selectedStatus() === 'all'
          ? null
          : this.selectedStatus() as TaskStatus,
    });

    this.closeFilters();
  }

  clearFilters(): void {
    this.selectedCategoryId.set(null);
    this.selectedStatus.set('all');
    this.filtersCleared.emit();
    this.closeFilters();
  }
}
