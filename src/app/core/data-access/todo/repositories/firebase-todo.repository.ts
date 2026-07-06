import {
  Injectable,
} from '@angular/core';

import {
  TodoRepository,
} from '../../../../shared/data-access/contracts/todo.repository';
import {
  TodoState,
} from '../../../../shared/models/todo-state.model';

@Injectable()
export class FirebaseTodoRepository
  implements TodoRepository {

  async load(): Promise<TodoState> {
    throw new Error(
      'Firebase todavia no esta configurado.',
    );
  }

  async save(
    _state: TodoState,
  ): Promise<void> {
    throw new Error(
      'Firebase todavia no esta configurado.',
    );
  }
}
