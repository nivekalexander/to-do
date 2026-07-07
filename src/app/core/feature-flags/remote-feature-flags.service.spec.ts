import {
  TestBed,
} from '@angular/core/testing';

import {
  RemoteFeatureFlagsService,
} from './remote-feature-flags.service';

describe('RemoteFeatureFlagsService', () => {
  it('usa el valor local cuando Firebase no esta disponible', async () => {
    TestBed.configureTestingModule({
      providers: [
        RemoteFeatureFlagsService,
      ],
    });

    const service =
      TestBed.inject(
        RemoteFeatureFlagsService,
      );

    await service.initialize();

    expect(
      service.readBoolean(
        'task_filters_enabled',
        true,
      ),
    ).toBeTrue();
  });
});
