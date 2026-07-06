import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  clipboardOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-task-summary',
  standalone: true,
  imports: [IonIcon],
  templateUrl: './task-summary.component.html',
  styleUrl: './task-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSummaryComponent {
  readonly pendingCount = input.required<number>();
  readonly completedCount = input.required<number>();

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      clipboardOutline,
    });
  }
}
