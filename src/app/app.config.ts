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
import {
  IonicStorageModule,
} from '@ionic/storage-angular';

import {
  provideTodoRepository,
} from './core/data-access/todo/provide-todo-repository';
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
      withHashLocation(),
      withPreloading(PreloadAllModules),
    ),
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__todo_db',
      }),
    ),
    provideTodoRepository(),
  ],
};
