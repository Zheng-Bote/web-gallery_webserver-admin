import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const requirePasswordChangeGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Wenn Passwort-Änderung nötig ist...
  if (auth.passwordChangeRequired()) {
    // ...und der User versucht, woanders als auf die Change-Page zu kommen:
    // Umleitung zur Change-Page!
    return router.createUrlTree(['/change-password']);
  }

  // Alles gut, weitergehen
  return true;
};
