import {
  MockTodoRepository,
} from './mock-todo.repository';

describe('MockTodoRepository', () => {
  let repository: MockTodoRepository;

  beforeEach(() => {
    repository = new MockTodoRepository();
  });

  it('entrega datos de demostracion', async () => {
    const state = await repository.load();

    expect(state.tasks.length).toBeGreaterThan(0);
    expect(state.categories.length)
      .toBeGreaterThan(0);
  });

  it('mantiene los cambios durante la sesion', async () => {
    const state = await repository.load();

    await repository.save({
      ...state,
      tasks: [],
    });

    expect((await repository.load()).tasks)
      .toEqual([]);
  });
});
