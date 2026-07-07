import {
  TestBed,
} from '@angular/core/testing';

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

  it('crea y elimina una tarea', async () => {
    const task = {
      id: 'task-1',
      title: 'Preparar entrevista',
      categoryId: null,
      status: 'not-started' as const,
      createdAt: 1,
      updatedAt: 1,
    };

    await repository.createTask(task);

    expect((await repository.load()).tasks)
      .toEqual([task]);

    await repository.deleteTask(task.id);

    expect((await repository.load()).tasks)
      .toEqual([]);
  });

  it('crea y actualiza una categoria', async () => {
    const category = {
      id: 'work',
      name: 'Trabajo',
      createdAt: 1,
      updatedAt: 1,
    };

    await repository.createCategory(category);

    await repository.updateCategory({
      ...category,
      name: 'Oficina',
      updatedAt: 2,
    });

    expect(
      (await repository.load())
        .categories[0].name,
    ).toBe('Oficina');
  });
});
