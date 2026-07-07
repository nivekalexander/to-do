import {
  inject,
  Injectable,
} from '@angular/core';
import {
  fetchAndActivate,
  getBoolean,
  isSupported,
  RemoteConfig,
} from '@angular/fire/remote-config';

import {
  environment,
} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RemoteFeatureFlagsService {
  private readonly remoteConfig =
    inject(
      RemoteConfig,
      { optional: true },
    );

  private initialization:
    Promise<void> | null = null;

  private ready = false;

  initialize(): Promise<void> {
    this.initialization ??=
      this.loadRemoteConfig();

    return this.initialization;
  }

  readBoolean(
    key: string,
    fallback: boolean,
  ): boolean {
    if (
      !this.ready
      || !this.remoteConfig
    ) {
      return fallback;
    }

    return getBoolean(
      this.remoteConfig,
      key,
    );
  }

  private async loadRemoteConfig():
    Promise<void> {

    try {
      if (
        !environment.remoteConfig.enabled
        || !this.remoteConfig
        || !(await isSupported())
      ) {
        return;
      }

      this.remoteConfig.defaultConfig = {
        ...environment
          .remoteConfig
          .defaultValues,
      };

      this.remoteConfig.settings = {
        fetchTimeoutMillis:
          environment
            .remoteConfig
            .fetchTimeoutMillis,
        minimumFetchIntervalMillis:
          environment
            .remoteConfig
            .minimumFetchIntervalMillis,
      };

      await fetchAndActivate(
        this.remoteConfig,
      );
    } catch {
      // Remote Config must fail safely.
      // The app continues with local defaults.
    } finally {
      this.ready = true;
    }
  }
}
