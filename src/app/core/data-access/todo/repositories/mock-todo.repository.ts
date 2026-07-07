import {
  Injectable,
} from '@angular/core';

import {
  TodoRepository,
} from '../../../../shared/data-access/contracts/todo.repository';
import {
  Category,
} from '../../../../shared/models/category.model';
import {
  Task,
} from '../../../../shared/models/task.model';
import {
  TODO_STATE_VERSION,
  TodoState,
} from '../../../../shared/models/todo-state.model';

function createMockState(): TodoState {
  const now = Date.now();

  return {
    version: TODO_STATE_VERSION,
    categories: [
      {
        id: 'category-work',
        name: 'Trabajo',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'category-personal',
        name: 'Personal',
        createdAt: now,
        updatedAt: now,
      },
    ],
    tasks: [
      {
        id: 'task-report',
        title: 'Revisar informe mensual',
        categoryId: 'category-work',
        status: 'in-progress',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-shopping',
        title: 'Comprar ingredientes',
        categoryId: 'category-personal',
        status: 'not-started',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'task-invoice',
        title: 'Pagar factura de luz',
        categoryId: 'category-personal',
        status: 'finished',
        createdAt: now,
        updatedAt: now,
      },
    ],
  };
}

@Injectable()
export class MockTodoRepository
  implements TodoRepository {

  private state = createMockState();

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
