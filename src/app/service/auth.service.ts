import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, Observable, catchError, of } from 'rxjs';
import { LoginResponse } from '../models/auth.model'; // Deine bestehende Model-Datei
import { environment } from '../../environments/environment';

// Definition des Users, wie er vom Backend (/auth/me) kommt
export interface AuthUser {
  id: number;
  username: string;
  force_password_change: boolean;
  is_active?: boolean;
  // ggf. weitere Felder
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  // --- SIGNALS ---
  accessToken = signal<string | null>(localStorage.getItem('token'));
  // username halten wir synchron, ist aber im currentUser auch enthalten
  username = signal<string | null>(localStorage.getItem('username'));

  // NEU: Der komplett eingeloggte User als Objekt
  currentUser = signal<AuthUser | null>(null);

  // NEU: Signal für den Zwang zur Passwortänderung
  passwordChangeRequired = signal<boolean>(false);

  // --- LOGIN ---
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response) => {
          // 1. Tokens speichern (wie gehabt)
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('username', username);

          this.accessToken.set(response.token);
          this.username.set(username);

          // 2. NEU: Nach erfolgreichem Token-Erhalt sofort den User-Status prüfen!
          // Wir rufen checkAuth auf, damit currentUser gesetzt wird
          // und ggf. die Umleitung zu /change-password passiert.
          this.checkAuth().subscribe();
        })
      );
  }

  // --- LOGOUT ---
  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      // Error Handling falls Token schon invalid ist
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe({
        error: () =>
          console.log('Logout API fail (token expired?), local logout anyway'),
      });
    }

    // Local Storage leeren
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');

    // Signals resetten
    this.accessToken.set(null);
    this.username.set(null);
    this.currentUser.set(null);
    this.passwordChangeRequired.set(false);

    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.accessToken();
  }

  // --- CHECK AUTH ---
  // Wird in app.component.ts (beim Reload) und nach dem Login aufgerufen
  checkAuth(): Observable<AuthUser | null> {
    // Wenn wir gar kein Token haben, brauchen wir nicht fragen
    if (!this.accessToken()) {
      return of(null);
    }

    // Endpoint: Woher bekomme ich "meine" Daten?
    // Passe die URL ggf. an (z.B. /api/admin/users/me oder /api/auth/me)
    return this.http.get<AuthUser>(`${this.apiUrl}/api/auth/me`).pipe(
      tap((user) => {
        this.setUserData(user);
      }),
      catchError((err) => {
        console.error('CheckAuth fehlgeschlagen', err);
        // Falls Token abgelaufen (401), sauber ausloggen
        if (err.status === 401) {
          this.logout();
        }
        return of(null);
      })
    );
  }

  // --- HELPER ---
  // Zentrale Stelle, die entscheidet: Darf er rein oder muss er Passwort ändern?
  private setUserData(user: AuthUser) {
    this.currentUser.set(user);
    // Nur zur Sicherheit username Signal syncen
    this.username.set(user.username);

    if (user.force_password_change) {
      console.warn('Passwort-Änderung erzwungen!');
      this.passwordChangeRequired.set(true);
      this.router.navigate(['/change-password']);
    } else {
      this.passwordChangeRequired.set(false);

      // Falls wir gerade vom Login kommen, weiter zum Dashboard
      if (this.router.url.includes('/login')) {
        this.router.navigate(['/dashboard']);
      }
    }
  }
}
