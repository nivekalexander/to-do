import { TestBed } from '@angular/core/testing';

import {
  AppStorage,
} from '../../../storage/app-storage';
import {
  TODO_STATE_VERSION,
} from '../../../../shared/models/todo-state.model';
import {
  LocalTodoRepository,
} from './local-todo.repository';

class AppStorageMock {
  private readonly data =
    new Map<string, unknown>();

  async get<T>(
    key: string,
    defaultValue: T,
  ): Promise<T> {
    return this.data.has(key)
      ? this.data.get(key) as T
      : defaultValue;
  }

  async set<T>(
    key: string,
    value: T,
  ): Promise<void> {
    this.data.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.data.delete(key);
  }
}

describe('LocalTodoRepository', () => {
  let repository: LocalTodoRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalTodoRepository,
        {
          provide: AppStorage,
          useClass: AppStorageMock,
        },
      ],
    });

    repository =
      TestBed.inject(LocalTodoRepository);
  });

  it('devuelve un estado inicial sin datos', async () => {
    const state = await repository.load();

    expect(state).toEqual({
      version: TODO_STATE_VERSION,
      tasks: [],
      categories: [],
    });
  });

  it('guarda y recupera el estado', async () => {
    const state = {
      version: TODO_STATE_VERSION,
      tasks: [],
      categories: [
        {
          id: 'work',
          name: 'Trabajo',
          createdAt: 1,
          updatedAt: 1,
        },
      ],
    };

    await repository.save(state);

    expect(await repository.load())
      .toEqual(state);
  });
});
