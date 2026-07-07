import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  IonContent,
  IonFooter,
  IonHeader,
  IonSpinner,
  IonToast,
  IonToolbar,
} from '@ionic/angular/standalone';

import {
  AppHeaderComponent,
} from '../../../../core/layout/app-header/app-header.component';
import {
  BottomNavigationComponent,
} from '../../../../core/layout/bottom-navigation/bottom-navigation.component';
import {
  CategoryManagerComponent,
  RenameCategoryInput,
} from '../../components/category-manager/category-manager.component';
import {
  CategoriesFacade,
} from '../../data-access/categories.facade';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    IonContent,
    IonFooter,
    IonHeader,
    IonSpinner,
    IonToast,
    IonToolbar,
    AppHeaderComponent,
    BottomNavigationComponent,
    CategoryManagerComponent,
  ],
  templateUrl: './category-list.page.html',
  styleUrl: './category-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListPage implements OnInit {
  readonly facade = inject(CategoriesFacade);

  readonly toastOpen = signal(false);
  readonly toastMessage = signal('');

  async ngOnInit(): Promise<void> {
    await this.facade.initialize();
  }

  async createCategory(name: string): Promise<void> {
    try {
      await this.facade.addCategory(name);
    } catch (error) {
      this.showError(error);
    }
  }

  async renameCategory(
    input: RenameCategoryInput,
  ): Promise<void> {
    try {
      await this.facade.updateCategory(
        input.id,
        input.name,
      );
    } catch (error) {
      this.showError(error);
    }
  }

  async deleteCategory(
    categoryId: string,
  ): Promise<void> {
    try {
      await this.facade.deleteCategory(categoryId);
    } catch (error) {
      this.showError(error);
    }
  }

  private showError(error: unknown): void {
    this.toastMessage.set(
      error instanceof Error
        ? error.message
        : 'No fue posible completar la operacion.',
    );

    this.toastOpen.set(true);
  }
}
