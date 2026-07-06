import {
  inject,
  Injectable,
} from '@angular/core';

import {
  TodoStore,
} from '../../../shared/data-access/todo-store';

@Injectable({
  providedIn: 'root',
})
export class CategoriesFacade {
  private readonly store = inject(TodoStore);

  readonly loading = this.store.loading;
  readonly categories = this.store.categories;

  initialize(): Promise<void> {
    return this.store.initialize();
  }

  addCategory(name: string): Promise<void> {
    return this.store.addCategory(name);
  }

  updateCategory(
    categoryId: string,
    name: string,
  ): Promise<void> {
    return this.store.updateCategory(
      categoryId,
      name,
    );
  }

  deleteCategory(
    categoryId: string,
  ): Promise<void> {
    return this.store.deleteCategory(categoryId);
  }
}
