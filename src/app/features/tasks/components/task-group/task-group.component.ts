import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  IonAccordion,
  IonAccordionGroup,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  timeOutline,
  syncOutline,
} from 'ionicons/icons';

import {
  EmptyStateComponent,
} from '../../../../shared/components/empty-state/empty-state.component';
import {
  Category,
} from '../../../../shared/models/category.model';
import {
  Task,
  TaskStatus,
} from '../../../../shared/models/task.model';
import {
  TaskItemComponent,
} from '../task-item/task-item.component';

@Component({
  selector: 'app-task-group',
  standalone: true,
  imports: [
    IonAccordion,
    IonAccordionGroup,
    IonIcon,
    IonItem,
    IonLabel,
    EmptyStateComponent,
    TaskItemComponent,
  ],
  templateUrl: './task-group.component.html',
  styleUrl: './task-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskGroupComponent {
  readonly title = input.required<string>();
  readonly status = input.required<TaskStatus>();
  readonly tasks = input.required<readonly Task[]>();
  readonly categories =
    input<readonly Category[]>([]);

  readonly taskMenuOpened = output<Task>();

  readonly iconName = computed(() => {
    const status = this.status();

    if (status === 'in-progress') {
      return 'sync-outline';
    }

    if (status === 'finished') {
      return 'checkmark-circle-outline';
    }

    return 'time-outline';
  });

  readonly emptyMessage = computed(() => {
    const status = this.status();

    if (status === 'in-progress') {
      return 'No hay tareas en progreso.';
    }

    if (status === 'finished') {
      return 'No hay tareas terminadas.';
    }

    return 'No hay tareas sin iniciar.';
  });

  private readonly categoryNames = computed(
    () =>
      new Map(
        this.categories().map(category => [
          category.id,
          category.name,
        ]),
      ),
  );

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      timeOutline,
      syncOutline,
    });
  }

  getCategoryName(
    categoryId: string | null,
  ): string {
    if (!categoryId) {
      return 'Sin categoria';
    }

    return (
      this.categoryNames().get(categoryId)
      ?? 'Sin categoria'
    );
  }
}
