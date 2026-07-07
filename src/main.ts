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

function waitForDeviceReady():
  Promise<void> {

  if (!isCordovaRuntime()) {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    document.addEventListener(
      'deviceready',
      () => resolve(),
      { once: true },
    );
  });
}

function applyViewportHeight(): void {
  if (!isCordovaRuntime()) {
    return;
  }

  const viewportHeight = Math.round(
    window.visualViewport?.height
    ?? window.innerHeight,
  );

  const value = `${viewportHeight}px`;

  document.documentElement.style.height = value;
  document.body.style.height = value;

  const ionApp =
    document.querySelector<HTMLElement>('ion-app');

  if (ionApp) {
    ionApp.style.height = value;
    ionApp.style.minHeight = value;
  }
}

function scheduleViewportRefresh(): void {
  requestAnimationFrame(() => {
    applyViewportHeight();

    requestAnimationFrame(() => {
      applyViewportHeight();
    });
  });

  window.setTimeout(
    () => applyViewportHeight(),
    150,
  );
}

function registerViewportListeners(): void {
  if (!isCordovaRuntime()) {
    return;
  }

  window.addEventListener(
    'resize',
    () => applyViewportHeight(),
    { passive: true },
  );

  window.visualViewport?.addEventListener(
    'resize',
    () => applyViewportHeight(),
    { passive: true },
  );

  document.addEventListener(
    'resume',
    () => scheduleViewportRefresh(),
  );

  document.addEventListener(
    'visibilitychange',
    () => {
      if (
        document.visibilityState === 'visible'
      ) {
        scheduleViewportRefresh();
      }
    },
  );
}

async function bootstrap(): Promise<void> {
  await loadCordovaScript();
  await waitForDeviceReady();

  applyViewportHeight();

  await bootstrapApplication(
    AppComponent,
    appConfig,
  );

  registerViewportListeners();
  scheduleViewportRefresh();
}

void bootstrap();
