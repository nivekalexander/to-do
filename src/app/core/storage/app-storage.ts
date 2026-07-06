import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AppStorage {
  private readonly storage = inject(Storage);

  private database: Storage | null = null;
  private initialization: Promise<Storage> | null = null;

  async get<T>(key: string, defaultValue: T): Promise<T> {
    const database = await this.getDatabase();
    const value = await database.get(key);

    return value ?? defaultValue;
  }

  async set<T>(key: string, value: T): Promise<void> {
    const database = await this.getDatabase();
    await database.set(key, value);
  }

  async remove(key: string): Promise<void> {
    const database = await this.getDatabase();
    await database.remove(key);
  }

  private async getDatabase(): Promise<Storage> {
    if (this.database) {
      return this.database;
    }

    this.initialization ??= this.storage.create();
    this.database = await this.initialization;

    return this.database;
  }
}

