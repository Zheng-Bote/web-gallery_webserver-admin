import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  created_at: string;
  is_active: boolean;
  password_changed_at?: string; // NEU: Datum der letzten Änderung
  force_password_change?: boolean; // NEU: Flag für Zwang
}

export interface User {
  id: number;
  username: string;
  created_at: string;
  is_active: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/admin/users`);
  }

  createUser(username: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/admin/users`,
      {
        username,
        password,
      },
      { responseType: 'text' }
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/admin/users/${id}`, {
      responseType: 'text',
    });
  }

  updateUserStatus(id: number, active: boolean) {
    return this.http.put(
      `${this.apiUrl}/api/admin/users/${id}/status`,
      { active },
      { responseType: 'text' }
    );
  }

  // 1. Admin setzt Passwort eines anderen Users zurück
  adminResetPassword(userId: number, newTempPass: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/admin/users/${userId}/reset-password`,
      { password: newTempPass },
      { responseType: 'text' } // Erwartet Text zurück
    );
  }

  // 2. Angemeldeter User ändert sein eigenes Passwort
  changeMyPassword(oldPass: string, newPass: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/user/change-password`,
      { oldPassword: oldPass, newPassword: newPass },
      { responseType: 'text' }
    );
  }
}
