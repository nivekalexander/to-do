import { TestBed } from '@angular/core/testing';

import { AppStorage } from '../../../core/storage/app-storage';
import { TaskState } from '../models/task-state.model';
import { TaskStore } from './task-store';

class AppStorageMock {
  private readonly values = new Map<string, unknown>();

  async get<T>(key: string, defaultValue: T): Promise<T> {
    return this.values.has(key)
      ? this.values.get(key) as T
      : defaultValue;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.values.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.values.delete(key);
  }
}

describe('TaskStore', () => {
  let store: TaskStore;
  let storage: AppStorageMock;

  beforeEach(() => {
    storage = new AppStorageMock();

    TestBed.configureTestingModule({
      providers: [
        TaskStore,
        {
          provide: AppStorage,
          useValue: storage,
        },
      ],
    });

    store = TestBed.inject(TaskStore);
  });

  it('inicia sin tareas ni categorías guardadas', async () => {
    await store.initialize();

    expect(store.tasks()).toEqual([]);
    expect(store.categories()).toEqual([]);
    expect(store.pendingCount()).toBe(0);
    expect(store.completedCount()).toBe(0);
  });

  it('agrega una tarea sin categoría por defecto', async () => {
    await store.initialize();

    await store.addTask('Comprar alimentos');

    expect(store.tasks().length).toBe(1);
    expect(store.tasks()[0].title).toBe('Comprar alimentos');
    expect(store.tasks()[0].categoryId).toBeNull();
    expect(store.tasks()[0].completed).toBeFalse();
  });

  it('limpia espacios al crear una tarea', async () => {
    await store.initialize();

    await store.addTask('  Preparar entrevista  ');

    expect(store.tasks()[0].title).toBe('Preparar entrevista');
  });

  it('rechaza una tarea con el título vacío', async () => {
    await store.initialize();

    await expectAsync(
      store.addTask('   '),
    ).toBeRejectedWithError('El título es obligatorio.');
  });

  it('marca una tarea pendiente como completada', async () => {
    await store.initialize();
    await store.addTask('Actualizar README');

    const taskId = store.tasks()[0].id;

    await store.toggleTask(taskId);

    expect(store.tasks()[0].completed).toBeTrue();
    expect(store.pendingCount()).toBe(0);
    expect(store.completedCount()).toBe(1);
  });

  it('elimina una tarea existente', async () => {
    await store.initialize();
    await store.addTask('Eliminar esta tarea');

    const taskId = store.tasks()[0].id;

    await store.deleteTask(taskId);

    expect(store.tasks()).toEqual([]);
  });

  it('evita crear categorías repetidas ignorando mayúsculas', async () => {
    await store.initialize();
    await store.addCategory('Trabajo');

    await expectAsync(
      store.addCategory('trabajo'),
    ).toBeRejectedWithError(
      'Ya existe una categoría con ese nombre.',
    );
  });

  it('deja las tareas sin categoría al eliminar su categoría', async () => {
    await store.initialize();
    await store.addCategory('Personal');

    const categoryId = store.categories()[0].id;

    await store.addTask('Ir al gimnasio', categoryId);
    await store.deleteCategory(categoryId);

    expect(store.categories()).toEqual([]);
    expect(store.tasks()[0].categoryId).toBeNull();
  });

  it('recupera el estado guardado al iniciar', async () => {
    const savedState: TaskState = {
      version: 1,
      tasks: [
        {
          id: 'task-1',
          title: 'Tarea guardada',
          completed: false,
          categoryId: null,
          createdAt: 1,
          updatedAt: 1,
        },
      ],
      categories: [],
    };

    await storage.set('todo-state', savedState);

    await store.initialize();

    expect(store.tasks().length).toBe(1);
    expect(store.tasks()[0].title).toBe('Tarea guardada');
  });
});