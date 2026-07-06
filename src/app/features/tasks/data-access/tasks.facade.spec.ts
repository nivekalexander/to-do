import { TestBed } from '@angular/core/testing';

import {
  TodoStore,
} from '../../../shared/data-access/todo-store';
import { TasksFacade } from './tasks.facade';

describe('TasksFacade', () => {
  const storeMock = {
    loading: () => false,
    categories: () => [],
    filters: () => ({
      categoryId: null,
      status: null,
    }),
    activeFilterCount: () => 0,
    filteredTasks: () => [],
    notStartedTasks: () => [],
    inProgressTasks: () => [],
    finishedTasks: () => [],
    pendingCount: () => 0,
    completedCount: () => 0,
    initialize: jasmine
      .createSpy('initialize')
      .and.resolveTo(),
    addTask: jasmine
      .createSpy('addTask')
      .and.resolveTo(),
    moveTask: jasmine
      .createSpy('moveTask')
      .and.resolveTo(),
    deleteTask: jasmine
      .createSpy('deleteTask')
      .and.resolveTo(),
    setFilters: jasmine.createSpy('setFilters'),
    clearFilters: jasmine.createSpy('clearFilters'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TasksFacade,
        {
          provide: TodoStore,
          useValue: storeMock,
        },
      ],
    });
  });

  it('delega la creacion de tareas', async () => {
    const facade = TestBed.inject(TasksFacade);

    await facade.addTask('Nueva tarea', null);

    expect(storeMock.addTask)
      .toHaveBeenCalledWith(
        'Nueva tarea',
        null,
      );
  });
});
