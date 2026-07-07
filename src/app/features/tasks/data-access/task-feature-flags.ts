import {
  inject,
  Injectable,
  signal,
} from '@angular/core';

import {
  environment,
} from '../../../../environments/environment';
import {
  RemoteFeatureFlagsService,
} from '../../../core/feature-flags/remote-feature-flags.service';

const TASK_FILTERS_ENABLED =
  'task_filters_enabled';

function resolveDefaultValue(): boolean {
  const value =
    environment
      .remoteConfig
      .defaultValues[
        TASK_FILTERS_ENABLED
      ];

  return typeof value === 'boolean'
    ? value
    : true;
}

@Injectable({
  providedIn: 'root',
})
export class TaskFeatureFlags {
  private readonly remoteFlags =
    inject(
      RemoteFeatureFlagsService,
    );

  readonly filtersEnabled =
    signal(resolveDefaultValue());

  async initialize(): Promise<void> {
    await this.remoteFlags.initialize();

    this.filtersEnabled.set(
      this.remoteFlags.readBoolean(
        TASK_FILTERS_ENABLED,
        resolveDefaultValue(),
      ),
    );
  }
}
