import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Services
import { AdminService } from '../../../service/admin.service';
import { AuthService } from '../../../service/auth.service';
import { NotificationService } from '../../../service/notification.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css', // Falls du CSS brauchst
})
export class ChangePasswordComponent {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  // Daten-Modell für das Formular
  passwords = {
    old: '',
    new: '',
    confirm: '',
  };

  // Signals für Passwort-Sichtbarkeit (Auge-Icon)
  hideOld = signal(true);
  hideNew = signal(true);
  hideConfirm = signal(true);

  // Status für Lade-Button
  isSubmitting = signal(false);

  // Validierung: Sind alle Bedingungen erfüllt?
  get isValid(): boolean {
    const p = this.passwords;
    return (
      p.old.length > 0 && // Altes PW muss da sein
      p.new.length >= 8 && // Neues PW mind. 8 Zeichen
      p.new === p.confirm // Wiederholung muss stimmen
    );
  }

  submit() {
    if (!this.isValid) return;

    this.isSubmitting.set(true);

    this.adminService
      .changeMyPassword(this.passwords.old, this.passwords.new)
      .subscribe({
        next: () => {
          this.notify.success('Passwort erfolgreich geändert.');

          // WICHTIG: Den "Zwang"-Status im AuthService aufheben
          this.authService.passwordChangeRequired.set(false);

          // Weiterleitung zum Dashboard
          this.router.navigate(['/dashboard']);
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error(err);
          // Fehlerbehandlung (z.B. falsches altes Passwort)
          if (err.status === 401 || err.status === 403) {
            this.notify.error('Das alte Passwort ist nicht korrekt.');
          } else {
            this.notify.error('Fehler beim Ändern des Passworts.');
          }
          this.isSubmitting.set(false);
        },
      });
  }
}
