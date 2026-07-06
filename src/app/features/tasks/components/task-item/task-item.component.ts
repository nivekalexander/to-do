import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  timeOutline,
  ellipsisVertical,
  syncOutline,
} from 'ionicons/icons';

import {
  Task,
  TaskStatus,
} from '../../../../shared/models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  readonly task = input.required<Task>();
  readonly categoryName =
    input('Sin categoria');

  readonly menuOpened = output<Task>();

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      timeOutline,
      ellipsisVertical,
      syncOutline,
    });
  }

  getStatusIcon(status: TaskStatus): string {
    if (status === 'in-progress') {
      return 'sync-outline';
    }

    if (status === 'finished') {
      return 'checkmark-circle-outline';
    }

    return 'time-outline';
  }
}
