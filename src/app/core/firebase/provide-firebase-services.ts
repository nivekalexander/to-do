import {
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import {
  initializeApp,
  provideFirebaseApp,
} from '@angular/fire/app';
import {
  getAuth,
  provideAuth,
} from '@angular/fire/auth';
import {
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';

import {
  environment,
} from '../../../environments/environment';

export function provideFirebaseServices():
  EnvironmentProviders {

  if (!environment.firebase.enabled) {
    return makeEnvironmentProviders([]);
  }

  return makeEnvironmentProviders([
    provideFirebaseApp(() =>
      initializeApp(
        environment.firebase.config,
      ),
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideRemoteConfig(() =>
      getRemoteConfig(),
    ),
  ]);
}
