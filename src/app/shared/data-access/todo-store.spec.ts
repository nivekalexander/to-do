import {
  TestBed,
} from '@angular/core/testing';

import {
  Category,
} from '../models/category.model';
import {
  Task,
} from '../models/task.model';
import {
  createInitialTodoState,
  TodoState,
} from '../models/todo-state.model';
import {
  TodoRepository,
} from './contracts/todo.repository';
import {
  TODO_REPOSITORY,
} from './todo-repository.token';
import { TodoStore } from './todo-store';

class TestTodoRepository
  implements TodoRepository {

  private state = createInitialTodoState();

  async load(): Promise<TodoState> {
    return structuredClone(this.state);
  }

  async createTask(task: Task): Promise<void> {
    this.state = {
      ...this.state,
      tasks: [
        task,
        ...this.state.tasks,
      ],
    };
  }

  async updateTask(task: Task): Promise<void> {
    this.state = {
      ...this.state,
      tasks: this.state.tasks.map(
        currentTask =>
          currentTask.id === task.id
            ? task
            : currentTask,
      ),
    };
  }

  async deleteTask(taskId: string):
    Promise<void> {

    this.state = {
      ...this.state,
      tasks: this.state.tasks.filter(
        task => task.id !== taskId,
      ),
    };
  }

  async createCategory(
    category: Category,
  ): Promise<void> {
    this.state = {
      ...this.state,
      categories: [
        ...this.state.categories,
        category,
      ],
    };
  }

  async updateCategory(
    category: Category,
  ): Promise<void> {
    this.state = {
      ...this.state,
      categories:
        this.state.categories.map(
          currentCategory =>
            currentCategory.id === category.id
              ? category
              : currentCategory,
        ),
    };
  }

  async deleteCategory(
    categoryId: string,
    tasksToUpdate: readonly Task[],
  ): Promise<void> {
    const updatedTasksById =
      new Map(
        tasksToUpdate.map(task => [
          task.id,
          task,
        ]),
      );

    this.state = {
      ...this.state,
      categories:
        this.state.categories.filter(
          category =>
            category.id !== categoryId,
        ),
      tasks: this.state.tasks.map(
        task =>
          updatedTasksById.get(task.id)
          ?? task,
      ),
    };
  }
}

describe('TodoStore', () => {
  let store: TodoStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoStore,
        {
          provide: TODO_REPOSITORY,
          useClass: TestTodoRepository,
        },
      ],
    });

    store = TestBed.inject(TodoStore);
  });

  it('inicia sin datos guardados', async () => {
    await store.initialize();

    expect(store.tasks()).toEqual([]);
    expect(store.categories()).toEqual([]);
  });

  it('crea una tarea en No iniciado', async () => {
    await store.initialize();
    await store.addTask('Preparar entrevista');

    expect(store.tasks().length).toBe(1);

    expect(store.tasks()[0].status)
      .toBe('not-started');
  });

  it('aplica filtros por estado', async () => {
    await store.initialize();
    await store.addTask('Tarea pendiente');
    await store.addTask('Tarea terminada');

    const taskId = store.tasks()[0].id;

    await store.moveTask(
      taskId,
      'finished',
    );

    store.setFilters({
      categoryId: null,
      status: 'finished',
    });

    expect(store.filteredTasks().length)
      .toBe(1);
  });

  it('limpia la categoria de las tareas al eliminarla', async () => {
    await store.initialize();
    await store.addCategory('Personal');

    const categoryId =
      store.categories()[0].id;

    await store.addTask(
      'Ir al gimnasio',
      categoryId,
    );

    await store.deleteCategory(categoryId);

    expect(store.tasks()[0].categoryId)
      .toBeNull();
  });
});
