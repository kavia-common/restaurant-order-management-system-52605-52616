import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page">
      <h1>Sign in</h1>
      <p class="muted">We’ll email you a magic link. No password required.</p>

      <label class="label">Email</label>
      <input class="input" [(ngModel)]="email" placeholder="you@example.com" />

      <button class="btn full" [disabled]="sending || !email.trim()" (click)="send()">
        {{ sending ? 'Sending…' : 'Send magic link' }}
      </button>

      <p class="muted small" *ngIf="sent">Check your email to continue.</p>
      <p class="muted small" *ngIf="error">{{ error }}</p>

      <div class="links">
        <a routerLink="/menu">Back to Menu</a>
      </div>
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 520px;
        margin: 40px auto;
        padding: 0 16px;
      }
      h1 {
        font-size: 28px;
        color: #0f172a;
      }
      .muted {
        color: #64748b;
        margin-top: 8px;
      }
      .small {
        font-size: 12px;
      }
      .label {
        display: block;
        font-size: 12px;
        margin-top: 16px;
        margin-bottom: 6px;
        color: #475569;
      }
      .input {
        width: 100%;
        border: 1px solid rgba(15, 23, 42, 0.12);
        border-radius: 10px;
        padding: 10px 12px;
        outline: none;
      }
      .btn.full {
        width: 100%;
        margin-top: 14px;
      }
      .links {
        margin-top: 16px;
      }
      a {
        color: #1d4ed8;
        text-decoration: none;
      }
    `,
  ],
})
export class SignInPage {
  private readonly auth = inject(AuthService);

  email = '';
  sending = false;
  sent = false;
  error: string | null = null;

  async send() {
    this.error = null;
    this.sent = false;
    this.sending = true;
    try {
      await this.auth.signInWithOtp(this.email.trim());
      this.sent = true;
    } catch (e: any) {
      this.error = e?.message ?? 'Failed to send link.';
    } finally {
      this.sending = false;
    }
  }
}
