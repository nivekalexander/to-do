import { signal } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { TaskStore } from '../../services/task-store';
import { TaskListPage } from './task-list.page';

describe('TaskListPage', () => {
  let component: TaskListPage;
  let fixture: ComponentFixture<TaskListPage>;

  const storeMock = {
    initialize: jasmine
      .createSpy('initialize')
      .and.resolveTo(),

    pendingCount: signal(0),
    completedCount: signal(0),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListPage],
      providers: [
        {
          provide: TaskStore,
          useValue: storeMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListPage);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

});