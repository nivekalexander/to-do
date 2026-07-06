import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  TaskActionsComponent,
} from './task-actions.component';

describe('TaskActionsComponent', () => {
  let component: TaskActionsComponent;
  let fixture:
    ComponentFixture<TaskActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskActionsComponent],
    }).compileComponents();

    fixture =
      TestBed.createComponent(TaskActionsComponent);

    component = fixture.componentInstance;

    fixture.componentRef.setInput('task', {
      id: 'task-1',
      title: 'Revisar informe',
      categoryId: null,
      status: 'not-started',
      createdAt: 1,
      updatedAt: 1,
    });

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  });

  it('emite el nuevo estado seleccionado', () => {
    const emitSpy = spyOn(
      component.moved,
      'emit',
    );

    component.moved.emit('in-progress');

    expect(emitSpy)
      .toHaveBeenCalledWith('in-progress');
  });

  it('emite la eliminacion de la tarea', () => {
    const emitSpy = spyOn(
      component.deleted,
      'emit',
    );

    component.deleted.emit();

    expect(emitSpy)
      .toHaveBeenCalled();
  });
});
