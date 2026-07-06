export type TodoDataSource =
  | 'local'
  | 'mock'
  | 'firebase';

export interface FirebaseEnvironment {
  enabled: boolean;
  projectId: string;
  collectionName: string;
  documentId: string;
}

export interface AppEnvironment {
  production: boolean;
  todoDataSource: TodoDataSource;
  firebase: FirebaseEnvironment;
}
