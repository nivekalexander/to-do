import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  IonIcon,
  IonModal,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    IonIcon,
    IonModal,
  ],
  templateUrl: './app-modal.component.html',
  styleUrl: './app-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppModalComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly description = input('');
  readonly backdropDismiss = input(true);
  readonly closed = output<void>();

  constructor() {
    addIcons({ closeOutline });
  }
}
