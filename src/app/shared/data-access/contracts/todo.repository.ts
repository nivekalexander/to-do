import {
  TodoState,
} from '../../models/todo-state.model';

export interface TodoRepository {
  load(): Promise<TodoState>;
  save(state: TodoState): Promise<void>;
}
