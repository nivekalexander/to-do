import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { TaskStore } from '../../services/task-store';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './task-list.page.html',
  styleUrl: './task-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListPage implements OnInit {
  readonly store = inject(TaskStore);

  async ngOnInit(): Promise<void> {
    await this.store.initialize();
  }
}

