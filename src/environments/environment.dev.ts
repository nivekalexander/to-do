import {
  AppEnvironment,
} from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  todoDataSource: 'firebase',

  firebase: {
    enabled: true,
    config: {
      apiKey:
        'AIzaSyAN3fh_UAuUrQreI5P3t2Vu1uCM6mkn2w0',
      authDomain:
        'to-do-90ec2.firebaseapp.com',
      projectId:
        'to-do-90ec2',
      storageBucket:
        'to-do-90ec2.firebasestorage.app',
      messagingSenderId:
        '254806934023',
      appId:
        '1:254806934023:web:7e7403b483fce74bffe0a2',
      measurementId:
        'G-T05MYB09PT',
    },
  },

  remoteConfig: {
    enabled: true,
    fetchTimeoutMillis: 10000,
    minimumFetchIntervalMillis: 0,
    defaultValues: {
      task_filters_enabled: true,
    },
  },
};
