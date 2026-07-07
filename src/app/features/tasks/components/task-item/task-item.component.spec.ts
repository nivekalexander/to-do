import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  Task,
} from '../../../../shared/models/task.model';
import {
  TaskItemComponent,
} from './task-item.component';

describe('TaskItemComponent', () => {
  let fixture:
    ComponentFixture<TaskItemComponent>;

  const task: Task = {
    id: 'task-1',
    title: 'Preparar presentacion',
    categoryId: null,
    status: 'not-started',
    createdAt: 1,
    updatedAt: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponent],
    }).compileComponents();

    fixture =
      TestBed.createComponent(TaskItemComponent);

    fixture.componentRef.setInput(
      'task',
      task,
    );

    fixture.detectChanges();
  });

  it('muestra el titulo de la tarea', () => {
    const element =
      fixture.nativeElement as HTMLElement;

    expect(element.textContent)
      .toContain('Preparar presentacion');
  });
});
