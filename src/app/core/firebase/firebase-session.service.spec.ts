import {
  TestBed,
} from '@angular/core/testing';
import {
  Auth,
} from '@angular/fire/auth';

import {
  FirebaseSessionService,
} from './firebase-session.service';

describe('FirebaseSessionService', () => {
  it('reutiliza el usuario autenticado', async () => {
    const authMock = {
      currentUser: {
        uid: 'user-1',
      },
      authStateReady:
        jasmine
          .createSpy('authStateReady')
          .and.resolveTo(),
    };

    TestBed.configureTestingModule({
      providers: [
        FirebaseSessionService,
        {
          provide: Auth,
          useValue: authMock,
        },
      ],
    });

    const service =
      TestBed.inject(FirebaseSessionService);

    expect(await service.getUserId())
      .toBe('user-1');

    expect(authMock.authStateReady)
      .toHaveBeenCalledTimes(1);
  });
});
