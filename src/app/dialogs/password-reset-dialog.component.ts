import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-password-reset-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Passwort zurücksetzen</h2>
    <mat-dialog-content>
      <p>Bitte gib ein neues, temporäres Passwort ein.</p>

      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Neues Passwort</mat-label>
        <input matInput [(ngModel)]="newPassword" type="text" cdkFocusInitial />
        <button
          mat-icon-button
          matSuffix
          (click)="generatePassword()"
          matTooltip="Zufallspasswort generieren"
        >
          <mat-icon>shuffle</mat-icon>
        </button>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Abbrechen</button>
      <button
        mat-raised-button
        color="primary"
        [mat-dialog-close]="newPassword"
        [disabled]="!newPassword"
      >
        Setzen
      </button>
    </mat-dialog-actions>
  `,
})
export class PasswordResetDialogComponent {
  private dialogRef = inject(MatDialogRef<PasswordResetDialogComponent>);
  newPassword = '';

  cancel() {
    this.dialogRef.close();
  }

  generatePassword() {
    // Einfacher Generator für 8-stelligen Code
    this.newPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-2);
  }
}
