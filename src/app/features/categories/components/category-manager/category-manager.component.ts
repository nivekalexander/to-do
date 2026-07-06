import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from '@ionic/angular/standalone';

import {
  Category,
} from '../../../../shared/models/category.model';

export interface RenameCategoryInput {
  id: string;
  name: string;
}

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonText,
  ],
  templateUrl: './category-manager.component.html',
  styleUrl: './category-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryManagerComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly categories =
    input<readonly Category[]>([]);

  readonly categoryCreated = output<string>();
  readonly categoryRenamed =
    output<RenameCategoryInput>();
  readonly categoryDeleted = output<string>();

  readonly editingCategoryId =
    signal<string | null>(null);

  readonly createForm =
    this.formBuilder.nonNullable.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
        ],
      ],
    });

  readonly editForm =
    this.formBuilder.nonNullable.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
        ],
      ],
    });

  createCategory(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const name =
      this.createForm.getRawValue().name;

    this.categoryCreated.emit(name);
    this.createForm.reset({ name: '' });
  }

  startEditing(category: Category): void {
    this.editingCategoryId.set(category.id);
    this.editForm.setValue({
      name: category.name,
    });
  }

  cancelEditing(): void {
    this.editingCategoryId.set(null);
    this.editForm.reset({ name: '' });
  }

  saveCategory(categoryId: string): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.categoryRenamed.emit({
      id: categoryId,
      name: this.editForm.getRawValue().name,
    });

    this.cancelEditing();
  }
}
