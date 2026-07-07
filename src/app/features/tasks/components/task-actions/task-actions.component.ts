import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  syncOutline,
  timeOutline,
  trashOutline,
} from 'ionicons/icons';

import {
  AppModalComponent,
} from '../../../../shared/components/app-modal/app-modal.component';
import {
  Task,
  TaskStatus,
} from '../../../../shared/models/task.model';

@Component({
  selector: 'app-task-actions',
  standalone: true,
  imports: [
    IonIcon,
    AppModalComponent,
  ],
  templateUrl: './task-actions.component.html',
  styleUrl: './task-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskActionsComponent {
  readonly task = input<Task | null>(null);
  readonly open = input(false);

  readonly moved = output<TaskStatus>();
  readonly deleted = output<void>();
  readonly closed = output<void>();

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      syncOutline,
      timeOutline,
      trashOutline,
    });
  }
}
