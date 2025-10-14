import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';

  constructor(private router: Router) {}

  /**
   * Checks if a user authentication token exists in localStorage.
   * @returns {boolean} True if the user is authenticated, otherwise false.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  /**
   * Simulates a user login. In a real app, this would involve an API call.
   * On success, it stores a mock token and navigates to the tasks page.
   * @param _credentials - Mock user credentials (not used in this simulation).
   * @returns An observable that emits true upon successful login.
   */
  login(_credentials: { user: string; pass: string }): Observable<boolean> {
    const mockToken = `mock-token-${Date.now()}`;
    return of(true).pipe(
      tap(() => {
        localStorage.setItem(this.AUTH_TOKEN_KEY, mockToken);
        this.router.navigate(['/tasks']);
      })
    );
  }

  /**
   * Logs the user out by clearing the authentication token
   * and redirecting to the login page.
   */
  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}
