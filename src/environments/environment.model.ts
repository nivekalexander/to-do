export type TodoDataSource =
  | 'local'
  | 'mock'
  | 'firebase';

export type RemoteConfigValue =
  | string
  | number
  | boolean;

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

export interface RemoteConfigEnvironment {
  enabled: boolean;
  fetchTimeoutMillis: number;
  minimumFetchIntervalMillis: number;
  defaultValues: Record<
    string,
    RemoteConfigValue
  >;
}

export interface AppEnvironment {
  production: boolean;
  todoDataSource: TodoDataSource;
  firebase: FirebaseEnvironment;
  remoteConfig: RemoteConfigEnvironment;
}
