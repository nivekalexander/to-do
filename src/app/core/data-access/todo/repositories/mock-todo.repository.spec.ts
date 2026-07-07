import {
  MockTodoRepository,
} from './mock-todo.repository';

describe('MockTodoRepository', () => {
  let repository: MockTodoRepository;

  beforeEach(() => {
    repository =
      new MockTodoRepository();
  });

  it('entrega datos de demostracion', async () => {
    const state = await repository.load();

    expect(state.tasks.length)
      .toBeGreaterThan(0);

    expect(state.categories.length)
      .toBeGreaterThan(0);
  });

  it('permite crear y actualizar tareas', async () => {
    const task = {
      id: 'task-new',
      title: 'Nueva tarea',
      categoryId: null,
      status: 'not-started' as const,
      createdAt: 1,
      updatedAt: 1,
    };

    await repository.createTask(task);

    await repository.updateTask({
      ...task,
      status: 'finished',
      updatedAt: 2,
    });

    const updatedTask =
      (await repository.load())
        .tasks.find(
          currentTask =>
            currentTask.id === task.id,
        );

    expect(updatedTask?.status)
      .toBe('finished');
  });
});
