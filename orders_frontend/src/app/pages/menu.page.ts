import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiClientService } from '../services/api-client.service';
import { CartService } from '../services/cart.service';
import { MenuItem } from '../models';

function centsToUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="header">
        <div>
          <h1>Menu</h1>
          <p class="muted">Pick items and add them to your cart.</p>
        </div>
        <a class="btn secondary" routerLink="/cart">Go to Cart</a>
      </div>

      <div class="grid" *ngIf="menu?.length; else loadingOrEmpty">
        <div class="card" *ngFor="let item of menu">
          <div class="card-top">
            <div class="title-row">
              <h2>{{ item.name }}</h2>
              <span class="pill" [class.off]="!item.isAvailable">{{ item.isAvailable ? 'Available' : 'Unavailable' }}</span>
            </div>
            <p class="desc" *ngIf="item.description">{{ item.description }}</p>
          </div>

          <div class="card-bottom">
            <div class="price">{{ price(item.priceCents) }}</div>
            <button class="btn" [disabled]="!item.isAvailable" (click)="add(item)">Add</button>
          </div>
        </div>
      </div>

      <ng-template #loadingOrEmpty>
        <div class="empty">
          <p class="muted">Loading menu…</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 1100px;
        margin: 24px auto;
        padding: 0 16px 48px;
      }
      .header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 16px;
      }
      .muted {
        color: #64748b;
        margin-top: 6px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 16px;
      }
      .card {
        grid-column: span 12;
        background: #ffffff;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 14px;
        padding: 16px;
        box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 140px;
      }
      @media (min-width: 700px) {
        .card {
          grid-column: span 6;
        }
      }
      @media (min-width: 1024px) {
        .card {
          grid-column: span 4;
        }
      }
      .title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      h1 {
        font-size: 28px;
        color: #0f172a;
      }
      h2 {
        font-size: 18px;
        color: #0f172a;
      }
      .desc {
        color: #475569;
        margin-top: 6px;
        line-height: 1.35;
      }
      .pill {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(6, 182, 212, 0.12);
        color: #0891b2;
        border: 1px solid rgba(6, 182, 212, 0.25);
        white-space: nowrap;
      }
      .pill.off {
        background: rgba(100, 116, 139, 0.12);
        color: #64748b;
        border: 1px solid rgba(100, 116, 139, 0.25);
      }
      .card-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
        gap: 12px;
      }
      .price {
        font-weight: 700;
        color: #0f172a;
      }
      .empty {
        padding: 24px 0;
      }
    `,
  ],
})
export class MenuPage {
  private readonly api = inject(ApiClientService);
  private readonly cart = inject(CartService);

  menu: MenuItem[] | null = null;

  async ngOnInit() {
    this.api.listMenu().subscribe((items) => (this.menu = items));
  }

  price(cents: number) {
    return centsToUsd(cents);
  }

  add(item: MenuItem) {
    this.cart.add(item, 1);
  }
}
