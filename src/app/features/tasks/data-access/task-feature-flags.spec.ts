import {
  TestBed,
} from '@angular/core/testing';

import {
  RemoteFeatureFlagsService,
} from '../../../core/feature-flags/remote-feature-flags.service';
import {
  TaskFeatureFlags,
} from './task-feature-flags';

describe('TaskFeatureFlags', () => {
  it('aplica el valor remoto del filtro', async () => {
    const remoteFlagsMock = {
      initialize: jasmine
        .createSpy('initialize')
        .and.resolveTo(),
      readBoolean: jasmine
        .createSpy('readBoolean')
        .and.returnValue(false),
    };

    TestBed.configureTestingModule({
      providers: [
        TaskFeatureFlags,
        {
          provide:
            RemoteFeatureFlagsService,
          useValue: remoteFlagsMock,
        },
      ],
    });

    const flags =
      TestBed.inject(TaskFeatureFlags);

    await flags.initialize();

    expect(
      flags.filtersEnabled(),
    ).toBeFalse();

    expect(
      remoteFlagsMock.readBoolean,
    ).toHaveBeenCalledWith(
      'task_filters_enabled',
      true,
    );
  });
});
