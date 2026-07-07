import { signal } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  Category,
} from '../../../../shared/models/category.model';
import {
  EMPTY_TASK_FILTERS,
} from '../../../../shared/models/task-filter.model';
import {
  Task,
} from '../../../../shared/models/task.model';
import {
  TaskFeatureFlags,
} from '../../data-access/task-feature-flags';
import {
  TasksFacade,
} from '../../data-access/tasks.facade';
import { TaskListPage } from './task-list.page';

describe('TaskListPage', () => {
  let fixture:
    ComponentFixture<TaskListPage>;

  const featureFlagsMock = {
    filtersEnabled: signal(true),
    initialize: jasmine
      .createSpy('initialize')
      .and.resolveTo(),
  };

  const facadeMock = {
    loading: signal(false),
    filters: signal({
      ...EMPTY_TASK_FILTERS,
    }),
    categories: signal<readonly Category[]>([]),
    pendingCount: signal(0),
    completedCount: signal(0),
    activeFilterCount: signal(0),
    filteredTasks: signal<readonly Task[]>([]),
    notStartedTasks: signal<readonly Task[]>([]),
    inProgressTasks: signal<readonly Task[]>([]),
    finishedTasks: signal<readonly Task[]>([]),
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListPage],
      providers: [
        provideRouter([]),
        {
          provide: TasksFacade,
          useValue: facadeMock,
        },
        {
          provide: TaskFeatureFlags,
          useValue: featureFlagsMock,
        },
      ],
    }).compileComponents();

    fixture =
      TestBed.createComponent(TaskListPage);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('inicia la feature al abrir la pagina', () => {
    expect(facadeMock.initialize)
      .toHaveBeenCalled();

    expect(featureFlagsMock.initialize)
      .toHaveBeenCalled();
  });
});
