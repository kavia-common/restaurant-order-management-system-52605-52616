import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiClientService } from '../services/api-client.service';
import { Order } from '../models';

function centsToUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

@Component({
  selector: 'app-order-tracking-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="header">
        <div>
          <h1>Order Tracking</h1>
          <p class="muted">Track status updates for your order.</p>
        </div>
        <a class="btn secondary" routerLink="/menu">Back to Menu</a>
      </div>

      <div class="card" *ngIf="order; else loading">
        <div class="top">
          <div>
            <div class="muted small">Order ID</div>
            <div class="id">{{ order.id }}</div>
          </div>
          <div class="status">
            <div class="muted small">Status</div>
            <div class="badge">{{ order.status }}</div>
          </div>
        </div>

        <div class="divider"></div>

        <div *ngIf="order.items.length; else noItems">
          <div class="row" *ngFor="let it of order.items">
            <div class="name">{{ it.name }}</div>
            <div class="muted">{{ it.quantity }} × {{ price(it.priceCents) }}</div>
            <div class="right">{{ price(it.priceCents * it.quantity) }}</div>
          </div>

          <div class="divider"></div>
          <div class="totals">
            <div class="muted">Total</div>
            <div class="total">{{ price(order.totalCents) }}</div>
          </div>
        </div>

        <ng-template #noItems>
          <p class="muted">No line items returned by backend yet.</p>
        </ng-template>
      </div>

      <ng-template #loading>
        <p class="muted">Loading order…</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 900px;
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
      h1 {
        font-size: 28px;
        color: #0f172a;
      }
      .muted {
        color: #64748b;
        margin-top: 6px;
      }
      .small {
        font-size: 12px;
        margin-top: 0;
      }
      .card {
        background: #ffffff;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 14px;
        padding: 16px;
      }
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      .id {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        margin-top: 4px;
      }
      .badge {
        display: inline-block;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.25);
        color: #1d4ed8;
        font-weight: 700;
      }
      .divider {
        height: 1px;
        background: rgba(15, 23, 42, 0.08);
        margin: 12px 0;
      }
      .row {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 12px;
        padding: 8px 0;
        align-items: center;
      }
      .name {
        font-weight: 600;
        color: #0f172a;
      }
      .right {
        text-align: right;
        font-weight: 700;
      }
      .totals {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
      }
      .total {
        font-size: 18px;
        font-weight: 800;
        color: #0f172a;
      }
    `,
  ],
})
export class OrderTrackingPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiClientService);

  order: Order | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.api.getOrder(id).subscribe((o) => (this.order = o));
  }

  price(cents: number) {
    return centsToUsd(cents);
  }
}
