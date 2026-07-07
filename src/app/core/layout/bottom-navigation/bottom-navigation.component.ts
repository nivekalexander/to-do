import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  IonIcon,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  folderOutline,
  listOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    IonIcon,
    IonToolbar,
  ],
  templateUrl: './bottom-navigation.component.html',
  styleUrl: './bottom-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavigationComponent {
  constructor() {
    addIcons({
      folderOutline,
      listOutline,
    });
  }
}
