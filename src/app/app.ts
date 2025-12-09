import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent], // <--- Import
  template: `
    <app-navbar></app-navbar>

    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [``],
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit() {
    this.authService.checkAuth().subscribe();
  }
}
