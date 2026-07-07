export type TodoDataSource =
  | 'local'
  | 'mock'
  | 'firebase';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface FirebaseEnvironment {
  enabled: boolean;
  config: FirebaseClientConfig;
}

export interface AppEnvironment {
  production: boolean;
  todoDataSource: TodoDataSource;
  firebase: FirebaseEnvironment;
}
