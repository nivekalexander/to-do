import {
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';

import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withHashLocation,
  withPreloading,
} from '@angular/router';

import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { IonicStorageModule } from '@ionic/storage-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },

    provideIonicAngular(),

    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withHashLocation(),
    ),

    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__todo_db',
      }),
    ),
  ],
};

