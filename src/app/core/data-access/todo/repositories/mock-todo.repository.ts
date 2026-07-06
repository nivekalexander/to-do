import {
  Injectable,
} from '@angular/core';

import {
  TodoRepository,
} from '../../../../shared/data-access/contracts/todo.repository';
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

  async save(state: TodoState): Promise<void> {
    this.state = structuredClone(state);
  }
}
