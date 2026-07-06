import {
  AppEnvironment,
} from './environment.model';

export const environment: AppEnvironment = {
  production: true,

  // The provider falls back to local storage while Firebase
  // is disabled. The future integration only changes this
  // environment and FirebaseTodoRepository.
  todoDataSource: 'firebase',

  firebase: {
    enabled: false,
    projectId: '',
    collectionName: 'app-state',
    documentId: 'todo',
  },
};
