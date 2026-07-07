import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  TaskFormComponent,
} from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture:
    ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
    }).compileComponents();

    fixture =
      TestBed.createComponent(TaskFormComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('no envia el formulario vacio', () => {
    const emitSpy = spyOn(
      component.taskCreated,
      'emit',
    );

    component.submit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('envia una tarea valida', () => {
    const emitSpy = spyOn(
      component.taskCreated,
      'emit',
    );

    component.form.setValue({
      title: 'Preparar entrevista',
      categoryId: '',
    });

    component.submit();

    expect(emitSpy).toHaveBeenCalledWith({
      title: 'Preparar entrevista',
      categoryId: null,
    });
  });
});
