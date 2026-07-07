import {
  bootstrapApplication,
} from '@angular/platform-browser';

import {
  AppComponent,
} from './app/app.component';
import {
  appConfig,
} from './app/app.config';

function isCordovaRuntime(): boolean {
  const {
    protocol,
    hostname,
    port,
  } = window.location;

  return (
    protocol === 'file:'
    || protocol === 'app:'
    || (
      protocol === 'https:'
      && hostname === 'localhost'
      && port === ''
    )
  );
}

function loadCordovaScript():
  Promise<void> {

  if (!isCordovaRuntime()) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existingScript =
      document.querySelector<HTMLScriptElement>(
        'script[data-cordova-runtime]',
      );

    if (existingScript) {
      resolve();
      return;
    }

    const script =
      document.createElement('script');

    script.src = 'cordova.js';
    script.dataset['cordovaRuntime'] = 'true';

    script.addEventListener(
      'load',
      () => resolve(),
      { once: true },
    );

    script.addEventListener(
      'error',
      () => reject(
        new Error(
          'No fue posible cargar cordova.js.',
        ),
      ),
      { once: true },
    );

    document.head.appendChild(script);
  });
}

async function bootstrap(): Promise<void> {
  await loadCordovaScript();

  await bootstrapApplication(
    AppComponent,
    appConfig,
  );
}

void bootstrap();
