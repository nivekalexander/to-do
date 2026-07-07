import {
  AppEnvironment,
} from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  todoDataSource: 'local',

  firebase: {
    enabled: false,
    config: {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    },
  },

  remoteConfig: {
    enabled: false,
    fetchTimeoutMillis: 5000,
    minimumFetchIntervalMillis: 0,
    defaultValues: {
      task_filters_enabled: true,
    },
  },
};
