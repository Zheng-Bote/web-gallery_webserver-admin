import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // <--- NEU
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // <--- NEU

import { PasswordResetDialogComponent } from '../../dialogs/password-reset-dialog.component'; // <--- Pfad anpassen
import { AdminService, User } from '../../service/admin.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTooltip,
    MatDialogModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);
  private dialog = inject(MatDialog);

  users = signal<User[]>([]);
  displayedColumns = ['id', 'username', 'created', 'status', 'actions'];

  // Modell für neuen User
  newUser = { username: '', password: '' };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (err) => console.error(err),
    });
  }

  addUser() {
    if (!this.newUser.username || !this.newUser.password) return;

    this.adminService
      .createUser(this.newUser.username, this.newUser.password)
      .subscribe({
        next: () => {
          this.notify.success('User angelegt');
          this.newUser = { username: '', password: '' }; // Felder leeren
          this.loadUsers(); // Liste aktualisieren
        },
        error: () =>
          this.notify.error('Fehler: User existiert vielleicht schon?'),
      });
  }

  deleteUser(user: User) {
    if (!confirm(`Benutzer "${user.username}" wirklich löschen?`)) return;

    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.notify.success('User gelöscht');
        this.loadUsers();
      },
      error: (err) => {
        // 403 Forbidden abfangen (Root Admin)
        if (err.status === 403)
          this.notify.error('Root-Admin kann nicht gelöscht werden!');
        else this.notify.error('Fehler beim Löschen');
      },
    });
  }

  resetPassword(user: User) {
    // Dialog öffnen
    const dialogRef = this.dialog.open(PasswordResetDialogComponent, {
      width: '400px',
    });

    // Warten bis Dialog geschlossen wird
    dialogRef.afterClosed().subscribe((result) => {
      // Wenn result existiert, hat der User auf "Setzen" geklickt
      if (result) {
        this.adminService.adminResetPassword(user.id, result).subscribe({
          next: () =>
            this.notify.success(
              `Passwort für ${user.username} wurde geändert.`
            ),
          error: () => this.notify.error('Fehler beim Zurücksetzen.'),
        });
      }
    });
  }

  toggleStatus(user: User) {
    // Optimistisches Update im UI oder warten?
    // Wir senden den neuen Status ans Backend.
    const newStatus = !user.is_active;

    this.adminService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => {
        user.is_active = newStatus; // UI aktualisieren
        this.notify.success(`User ${newStatus ? 'aktiviert' : 'deaktiviert'}`);
      },
      error: () => {
        this.notify.error('Fehler beim Ändern des Status');
        // Toggle im UI zurücksetzen (da Änderung fehlgeschlagen)
        user.is_active = !newStatus;
      },
    });
  }

  // Berechnet Tage bis Ablauf (30 Tage Gültigkeit)
  getDaysUntilExpiration(dateStr?: string): number {
    if (!dateStr) return 0; // Fallback

    const changedAt = new Date(dateStr);
    const expiresAt = new Date(changedAt);
    expiresAt.setDate(changedAt.getDate() + 30); // +30 Tage

    const today = new Date();
    const diffTime = expiresAt.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }
}
