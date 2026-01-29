import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-callback-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>Signing you in…</h1>
      <p class="muted">If you are not redirected, you can go back to the menu.</p>
      <button class="btn" (click)="goMenu()">Go to Menu</button>
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 720px;
        margin: 32px auto;
        padding: 0 16px;
      }
      .muted {
        color: #64748b;
        margin: 8px 0 16px;
      }
    `,
  ],
})
export class AuthCallbackPage {
  private readonly router = inject(Router);
  // Inject to ensure auth service initializes and receives session event.
  private readonly _auth = inject(AuthService);

  async ngOnInit() {
    // Give auth state change time to propagate then route.
    setTimeout(() => this.router.navigateByUrl('/menu'), 600);
  }

  goMenu() {
    this.router.navigateByUrl('/menu');
  }
}
