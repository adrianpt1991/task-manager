import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * A functional route guard that checks for user authentication.
 *
 * @returns {boolean | UrlTree} - Returns `true` if the user is authenticated,
 * allowing navigation to proceed. Otherwise, it returns a `UrlTree` to
 * redirect the user to the '/login' page.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // User is authenticated, allow access.
  }

  // User is not authenticated, redirect to the login page.
  return router.parseUrl('/login');
};
