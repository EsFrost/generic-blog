import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterLink,
  RouterOutlet,
  NavigationEnd,
  Router,
} from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { BackToTopComponent } from './components/back-to-the-top/back-to-the-top';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, BackToTopComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'generic-blog';
  private authService = inject(AuthService);
  private router = inject(Router);
  isAuthenticated$ = this.authService.isAuthenticated$;
  year: number = new Date().getFullYear();

  constructor() {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }
}
