import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
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
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/angular/standalone';

import {
  Category,
} from '../../../../shared/models/category.model';

export interface CreateTaskInput {
  title: string;
  categoryId: string | null;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonInput,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonText,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly categories =
    input<readonly Category[]>([]);

  readonly taskCreated =
    output<CreateTaskInput>();

  readonly form =
    this.formBuilder.nonNullable.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(80),
        ],
      ],
      categoryId: [''],
    });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.taskCreated.emit({
      title: value.title,
      categoryId: value.categoryId || null,
    });

    this.form.reset({
      title: '',
      categoryId: '',
    });
  }
}
