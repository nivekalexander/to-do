import {
  InjectionToken,
} from '@angular/core';

import {
  TodoRepository,
} from './contracts/todo.repository';

export const TODO_REPOSITORY =
  new InjectionToken<TodoRepository>(
    'TODO_REPOSITORY',
  );
