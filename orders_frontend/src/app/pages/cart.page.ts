import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ApiClientService } from '../services/api-client.service';

function centsToUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page">
      <div class="header">
        <div>
          <h1>Cart</h1>
          <p class="muted">Review your order and checkout.</p>
        </div>
        <a class="btn secondary" routerLink="/menu">Back to Menu</a>
      </div>

      <div class="layout">
        <div class="card">
          <h2>Items</h2>

          <div *ngIf="items.length; else empty">
            <div class="row" *ngFor="let it of items">
              <div>
                <div class="name">{{ it.menuItem.name }}</div>
                <div class="muted">{{ price(it.menuItem.priceCents) }} each</div>
              </div>
              <div class="qty">
                <button class="btn tiny secondary" (click)="dec(it.menuItem.id)">-</button>
                <input
                  class="input tiny"
                  type="number"
                  min="0"
                  [ngModel]="it.quantity"
                  (ngModelChange)="set(it.menuItem.id, $event)"
                />
                <button class="btn tiny secondary" (click)="inc(it.menuItem.id)">+</button>
              </div>
              <div class="lineTotal">{{ price(it.menuItem.priceCents * it.quantity) }}</div>
            </div>

            <div class="divider"></div>

            <div class="totals">
              <div class="muted">Total</div>
              <div class="total">{{ price(totalCents) }}</div>
            </div>
          </div>

          <ng-template #empty>
            <p class="muted">Your cart is empty.</p>
          </ng-template>
        </div>

        <div class="card">
          <h2>Checkout</h2>

          <label class="label">Name (optional)</label>
          <input class="input" [(ngModel)]="customerName" placeholder="Jane Doe" />

          <label class="label">Phone (optional)</label>
          <input class="input" [(ngModel)]="customerPhone" placeholder="+1 555 555 5555" />

          <button class="btn full" [disabled]="!items.length || placing" (click)="placeOrder()">
            {{ placing ? 'Placing order…' : 'Place order' }}
          </button>

          <p class="muted small" *ngIf="orderId">
            Order placed: <strong>{{ orderId }}</strong>
          </p>
        </div>
      </div>
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
      .layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }
      @media (min-width: 900px) {
        .layout {
          grid-template-columns: 1.2fr 0.8fr;
        }
      }
      .card {
        background: #ffffff;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 14px;
        padding: 16px;
      }
      h1 {
        font-size: 28px;
        color: #0f172a;
      }
      h2 {
        font-size: 18px;
        color: #0f172a;
        margin-bottom: 12px;
      }
      .muted {
        color: #64748b;
        margin-top: 6px;
      }
      .row {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 12px;
        align-items: center;
        padding: 10px 0;
      }
      .name {
        font-weight: 600;
        color: #0f172a;
      }
      .qty {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .lineTotal {
        text-align: right;
        font-weight: 700;
      }
      .divider {
        height: 1px;
        background: rgba(15, 23, 42, 0.08);
        margin: 12px 0;
      }
      .totals {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
      }
      .total {
        font-size: 20px;
        font-weight: 800;
        color: #0f172a;
      }
      .label {
        display: block;
        font-size: 12px;
        margin-top: 10px;
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
      .input.tiny {
        width: 64px;
        padding: 6px 8px;
        border-radius: 8px;
        text-align: center;
      }
      .btn.full {
        width: 100%;
        margin-top: 14px;
      }
      .btn.tiny {
        padding: 6px 10px;
        border-radius: 10px;
      }
      .small {
        font-size: 12px;
        margin-top: 12px;
      }
    `,
  ],
})
export class CartPage {
  private readonly cart = inject(CartService);
  private readonly api = inject(ApiClientService);
  private readonly router = inject(Router);

  customerName = '';
  customerPhone = '';
  placing = false;
  orderId: string | null = null;

  get items() {
    return this.cart.getSnapshot();
  }

  get totalCents() {
    return this.cart.totalCents();
  }

  price(cents: number) {
    return centsToUsd(cents);
  }

  inc(id: string) {
    const it = this.items.find((x) => x.menuItem.id === id);
    if (!it) return;
    this.cart.setQuantity(id, it.quantity + 1);
  }

  dec(id: string) {
    const it = this.items.find((x) => x.menuItem.id === id);
    if (!it) return;
    this.cart.setQuantity(id, it.quantity - 1);
  }

  set(id: string, value: any) {
    const n = Number(value);
    if (Number.isNaN(n)) return;
    this.cart.setQuantity(id, n);
  }

  async placeOrder() {
    this.placing = true;
    try {
      const body = {
        customerName: this.customerName?.trim() || undefined,
        customerPhone: this.customerPhone?.trim() || undefined,
        items: this.items.map((i) => ({ menuItemId: i.menuItem.id, quantity: i.quantity })),
      };

      this.api.createOrder(body).subscribe((res) => {
        this.orderId = res.orderId;
        this.cart.clear();
        this.router.navigate(['/track', res.orderId]);
      });
    } finally {
      this.placing = false;
    }
  }
}
