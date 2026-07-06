import {
  AppEnvironment,
} from './environment.model';

export const environment: AppEnvironment = {
  production: false,

  // Development keeps the current data in Ionic Storage.
  // Use "mock" for demo data without changing application code.
  todoDataSource: 'local',

  firebase: {
    enabled: false,
    projectId: '',
    collectionName: 'app-state',
    documentId: 'todo',
  },
};
