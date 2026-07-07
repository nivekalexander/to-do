import {
  inject,
  Injectable,
} from '@angular/core';
import {
  Firestore,
} from '@angular/fire/firestore';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
  setDoc,
  writeBatch,
} from 'firebase/firestore';

import {
  FirebaseSessionService,
} from '../../../firebase/firebase-session.service';
import {
  TodoRepository,
} from '../../../../shared/data-access/contracts/todo.repository';
import {
  Category,
} from '../../../../shared/models/category.model';
import {
  Task,
  TaskStatus,
} from '../../../../shared/models/task.model';
import {
  TODO_STATE_VERSION,
  TodoState,
} from '../../../../shared/models/todo-state.model';

const MAX_BATCH_OPERATIONS = 400;

@Injectable()
export class FirebaseTodoRepository
  implements TodoRepository {

  private readonly firestore = inject(Firestore);

  private readonly session =
    inject(FirebaseSessionService);

  async load(): Promise<TodoState> {
    const userId =
      await this.session.getUserId();

    const [
      tasksSnapshot,
      categoriesSnapshot,
    ] = await Promise.all([
      getDocs(
        collection(
          this.firestore,
          'users',
          userId,
          'tasks',
        ),
      ),
      getDocs(
        collection(
          this.firestore,
          'users',
          userId,
          'categories',
        ),
      ),
    ]);

    const tasks = tasksSnapshot.docs
      .map(snapshot =>
        this.mapTask(snapshot),
      )
      .sort(
        (left, right) =>
          right.createdAt - left.createdAt,
      );

    const categories =
      categoriesSnapshot.docs
        .map(snapshot =>
          this.mapCategory(snapshot),
        )
        .sort((left, right) =>
          left.name.localeCompare(right.name),
        );

    return {
      version: TODO_STATE_VERSION,
      tasks,
      categories,
    };
  }

  async createTask(task: Task): Promise<void> {
    await this.saveTask(task);
  }

  async updateTask(task: Task): Promise<void> {
    await this.saveTask(task);
  }

  async deleteTask(taskId: string):
    Promise<void> {

    const userId =
      await this.session.getUserId();

    await deleteDoc(
      doc(
        this.firestore,
        'users',
        userId,
        'tasks',
        taskId,
      ),
    );
  }

  async createCategory(
    category: Category,
  ): Promise<void> {
    await this.saveCategory(category);
  }

  async updateCategory(
    category: Category,
  ): Promise<void> {
    await this.saveCategory(category);
  }

  async deleteCategory(
    categoryId: string,
    tasksToUpdate: readonly Task[],
  ): Promise<void> {
    const userId =
      await this.session.getUserId();

    const taskChunks =
      this.chunkTasks(tasksToUpdate);

    if (taskChunks.length === 0) {
      taskChunks.push([]);
    }

    for (
      let index = 0;
      index < taskChunks.length;
      index += 1
    ) {
      const batch =
        writeBatch(this.firestore);

      if (index === 0) {
        batch.delete(
          doc(
            this.firestore,
            'users',
            userId,
            'categories',
            categoryId,
          ),
        );
      }

      for (const task of taskChunks[index]) {
        batch.set(
          doc(
            this.firestore,
            'users',
            userId,
            'tasks',
            task.id,
          ),
          task,
        );
      }

      await batch.commit();
    }
  }

  private async saveTask(
    task: Task,
  ): Promise<void> {
    const userId =
      await this.session.getUserId();

    await setDoc(
      doc(
        this.firestore,
        'users',
        userId,
        'tasks',
        task.id,
      ),
      task,
    );
  }

  private async saveCategory(
    category: Category,
  ): Promise<void> {
    const userId =
      await this.session.getUserId();

    await setDoc(
      doc(
        this.firestore,
        'users',
        userId,
        'categories',
        category.id,
      ),
      category,
    );
  }

  private mapTask(
    snapshot:
      QueryDocumentSnapshot<DocumentData>,
  ): Task {
    const data = snapshot.data();

    const title = data['title'];
    const categoryId = data['categoryId'];
    const status = data['status'];
    const createdAt = data['createdAt'];
    const updatedAt = data['updatedAt'];

    if (
      typeof title !== 'string'
      || !this.isNullableString(categoryId)
      || !this.isTaskStatus(status)
      || typeof createdAt !== 'number'
      || typeof updatedAt !== 'number'
    ) {
      throw new Error(
        'Se encontro una tarea invalida en Firebase.',
      );
    }

    return {
      id: snapshot.id,
      title,
      categoryId,
      status,
      createdAt,
      updatedAt,
    };
  }

  private mapCategory(
    snapshot:
      QueryDocumentSnapshot<DocumentData>,
  ): Category {
    const data = snapshot.data();

    const name = data['name'];
    const createdAt = data['createdAt'];
    const updatedAt = data['updatedAt'];

    if (
      typeof name !== 'string'
      || typeof createdAt !== 'number'
      || typeof updatedAt !== 'number'
    ) {
      throw new Error(
        'Se encontro una categoria invalida en Firebase.',
      );
    }

    return {
      id: snapshot.id,
      name,
      createdAt,
      updatedAt,
    };
  }

  private isNullableString(
    value: unknown,
  ): value is string | null {
    return (
      value === null
      || typeof value === 'string'
    );
  }

  private isTaskStatus(
    value: unknown,
  ): value is TaskStatus {
    return (
      value === 'not-started'
      || value === 'in-progress'
      || value === 'finished'
    );
  }

  private chunkTasks(
    tasks: readonly Task[],
  ): Task[][] {
    const chunks: Task[][] = [];

    for (
      let index = 0;
      index < tasks.length;
      index += MAX_BATCH_OPERATIONS
    ) {
      chunks.push(
        tasks.slice(
          index,
          index + MAX_BATCH_OPERATIONS,
        ),
      );
    }

    return chunks;
  }
}
