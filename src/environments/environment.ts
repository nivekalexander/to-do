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
};
