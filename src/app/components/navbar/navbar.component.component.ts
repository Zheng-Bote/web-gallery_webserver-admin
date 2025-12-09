import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-button routerLink="/" class="logo">
        <mat-icon>photo_library</mat-icon> CrowGallery
      </button>

      <span class="spacer"></span>

      <ng-container *ngIf="!authService.currentUser()">
        <button mat-button routerLink="/login">Login</button>
      </ng-container>

      <ng-container *ngIf="authService.currentUser() as user">
        <button mat-button routerLink="/dashboard"><mat-icon>dashboard</mat-icon> Dashboard</button>

        <button
          mat-button
          [matMenuTriggerFor]="adminMenu"
          *ngIf="user.username === 'admin' || user.id === 1"
        >
          <mat-icon>admin_panel_settings</mat-icon> Admin
        </button>
        <mat-menu #adminMenu="matMenu">
          <button mat-menu-item routerLink="/admin/users">
            <mat-icon>group</mat-icon> User verwalten
          </button>
        </mat-menu>

        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>person</mat-icon> {{ user.username }}
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item routerLink="/change-password">
            <mat-icon>lock</mat-icon> Passwort ändern
          </button>
          <button mat-menu-item (click)="authService.logout()">
            <mat-icon>logout</mat-icon> Logout
          </button>
        </mat-menu>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [
    `
      .spacer {
        flex: 1 1 auto;
      }
      .logo {
        font-weight: bold;
        font-size: 1.1rem;
      }
    `,
  ],
})
export class NavbarComponent {
  authService = inject(AuthService);
}
