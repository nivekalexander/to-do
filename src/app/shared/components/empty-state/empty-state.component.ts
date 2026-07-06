import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fileTrayOutline } from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IonIcon],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly message = input('');
  readonly compact = input(false);

  constructor() {
    addIcons({ fileTrayOutline });
  }
}
