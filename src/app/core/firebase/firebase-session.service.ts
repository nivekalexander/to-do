import {
  inject,
  Injectable,
} from '@angular/core';
import {
  Auth,
} from '@angular/fire/auth';
import {
  browserLocalPersistence,
  setPersistence,
  signInAnonymously,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseSessionService {
  private readonly auth = inject(Auth);

  private userIdPromise:
    Promise<string> | null = null;

  getUserId(): Promise<string> {
    if (!this.userIdPromise) {
      this.userIdPromise =
        this.resolveUserId().catch(error => {
          this.userIdPromise = null;
          throw error;
        });
    }

    return this.userIdPromise;
  }

  private async resolveUserId():
    Promise<string> {

    await this.auth.authStateReady();

    if (this.auth.currentUser) {
      return this.auth.currentUser.uid;
    }

    await setPersistence(
      this.auth,
      browserLocalPersistence,
    );

    const credential =
      await signInAnonymously(this.auth);

    return credential.user.uid;
  }
}
