import {
  AppEnvironment,
} from './environment.model';

export const environment: AppEnvironment = {
  production: true,
  todoDataSource: 'firebase',

  firebase: {
    enabled: true,
    config: {
      apiKey:
        'AIzaSyDGywIk-erBwg8-Ak4s5dzWhmL0YUSysGk',
      authDomain:
        'to-do-prod-426ec.firebaseapp.com',
      projectId:
        'to-do-prod-426ec',
      storageBucket:
        'to-do-prod-426ec.firebasestorage.app',
      messagingSenderId:
        '560006178503',
      appId:
        '1:560006178503:web:6662402244fd63af1f40e2',
    },
  },

  remoteConfig: {
    enabled: true,
    fetchTimeoutMillis: 10000,
    minimumFetchIntervalMillis: 3600000,
    defaultValues: {
      task_filters_enabled: true,
    },
  },
};
