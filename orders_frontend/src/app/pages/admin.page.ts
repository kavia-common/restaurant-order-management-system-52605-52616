import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiClientService } from '../services/api-client.service';
import { Order } from '../models';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="header">
        <div>
          <h1>Admin</h1>
          <p class="muted">Manage menu and review all orders.</p>
        </div>
        <a class="btn secondary" routerLink="/menu">Back to Menu</a>
      </div>

      <div class="grid">
        <div class="card">
          <h2>Orders</h2>
          <p class="muted small">Backend currently may not expose admin endpoints; list will be empty until implemented.</p>

          <div *ngIf="orders.length; else emptyOrders">
            <div class="order" *ngFor="let o of orders">
              <div>
                <div class="id">{{ o.id }}</div>
                <div class="muted small">{{ o.status }} • {{ o.createdAt }}</div>
              </div>
              <a class="btn tiny secondary" [routerLink]="['/track', o.id]">Open</a>
            </div>
          </div>

          <ng-template #emptyOrders>
            <p class="muted">No orders to show.</p>
          </ng-template>
        </div>

        <div class="card">
          <h2>Menu management</h2>
          <p class="muted">
            This UI is wired for admin role navigation. Hook up backend endpoints like <code>POST /admin/menu</code> to enable
            create/update actions.
          </p>

          <div class="placeholder">
            <div class="muted small">Coming soon</div>
            <div class="muted">Add endpoints for menu CRUD and connect them here.</div>
          </div>
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
      h1 {
        font-size: 28px;
        color: #0f172a;
      }
      h2 {
        font-size: 18px;
        color: #0f172a;
        margin-bottom: 8px;
      }
      .muted {
        color: #64748b;
        margin-top: 6px;
      }
      .small {
        font-size: 12px;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }
      @media (min-width: 900px) {
        .grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      .card {
        background: #ffffff;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 14px;
        padding: 16px;
      }
      .order {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 0;
        border-top: 1px solid rgba(15, 23, 42, 0.06);
      }
      .order:first-of-type {
        border-top: none;
      }
      .id {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
      }
      .placeholder {
        margin-top: 12px;
        border: 1px dashed rgba(15, 23, 42, 0.18);
        border-radius: 12px;
        padding: 14px;
        background: rgba(59, 130, 246, 0.03);
      }
      .btn.tiny {
        padding: 6px 10px;
        border-radius: 10px;
      }
    `,
  ],
})
export class AdminPage {
  private readonly api = inject(ApiClientService);

  orders: Order[] = [];

  ngOnInit() {
    this.api.listAllOrders().subscribe((orders) => (this.orders = orders));
  }
}
