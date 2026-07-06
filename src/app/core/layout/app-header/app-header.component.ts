import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import {
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent {
  readonly title = input('To-Do');
}
