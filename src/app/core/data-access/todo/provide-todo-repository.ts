import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  Type,
} from '@angular/core';

import {
  environment,
} from '../../../../environments/environment';
import {
  TodoRepository,
} from '../../../shared/data-access/contracts/todo.repository';
import {
  TODO_REPOSITORY,
} from '../../../shared/data-access/todo-repository.token';
import {
  FirebaseTodoRepository,
} from './repositories/firebase-todo.repository';
import {
  LocalTodoRepository,
} from './repositories/local-todo.repository';
import {
  MockTodoRepository,
} from './repositories/mock-todo.repository';

function resolveRepository():
  Type<TodoRepository> {

  switch (environment.todoDataSource) {
    case 'mock':
      return MockTodoRepository;

    case 'firebase':
      return environment.firebase.enabled
        ? FirebaseTodoRepository
        : LocalTodoRepository;

    case 'local':
    default:
      return LocalTodoRepository;
  }
}

export function provideTodoRepository():
  EnvironmentProviders {

  return makeEnvironmentProviders([
    {
      provide: TODO_REPOSITORY,
      useClass: resolveRepository(),
    },
  ]);
}
