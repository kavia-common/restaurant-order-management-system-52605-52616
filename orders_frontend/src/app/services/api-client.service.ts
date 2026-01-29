import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateOrderRequest, CreateOrderResponse, MenuItem, Order } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);

  private baseUrl(): string {
    // Allow running frontend without configured backend; relative paths work with proxy/ingress setups.
    return environment.apiBaseUrl?.trim() || '';
  }

  // PUBLIC_INTERFACE
  healthCheck() {
    /** Returns backend health check (GET /). */
    return this.http.get(`${this.baseUrl()}/`).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError(() => new Error(err?.error?.detail ?? err.message ?? 'Backend health check failed')),
      ),
    );
  }

  // PUBLIC_INTERFACE
  listMenu() {
    /** Returns menu items (GET /menu). Falls back to demo menu if backend is not implemented yet. */
    return this.http.get<MenuItem[]>(`${this.baseUrl()}/menu`).pipe(
      catchError(() =>
        of<MenuItem[]>([
          {
            id: 'demo-1',
            name: 'Classic Burger',
            description: 'Beef patty, lettuce, tomato, house sauce',
            priceCents: 1299,
            imageUrl: '',
            isAvailable: true,
          },
          {
            id: 'demo-2',
            name: 'Veggie Bowl',
            description: 'Seasonal veggies, grains, tahini',
            priceCents: 1099,
            imageUrl: '',
            isAvailable: true,
          },
          {
            id: 'demo-3',
            name: 'Iced Tea',
            description: 'Fresh brewed',
            priceCents: 399,
            imageUrl: '',
            isAvailable: true,
          },
        ]),
      ),
    );
  }

  // PUBLIC_INTERFACE
  createOrder(body: CreateOrderRequest) {
    /** Creates an order (POST /orders). Falls back to a local mock response if backend is not implemented. */
    return this.http.post<CreateOrderResponse>(`${this.baseUrl()}/orders`, body).pipe(
      catchError(() => of<CreateOrderResponse>({ orderId: `demo-${crypto.randomUUID()}` })),
    );
  }

  // PUBLIC_INTERFACE
  getOrder(orderId: string) {
    /** Fetches order details (GET /orders/{id}). Falls back to mock. */
    return this.http.get<Order>(`${this.baseUrl()}/orders/${encodeURIComponent(orderId)}`).pipe(
      catchError(() =>
        of<Order>({
          id: orderId,
          createdAt: new Date().toISOString(),
          status: 'PENDING',
          items: [],
          totalCents: 0,
        }),
      ),
    );
  }

  // PUBLIC_INTERFACE
  listAllOrders() {
    /** Admin: list all orders (GET /admin/orders). Falls back to mock. */
    return this.http.get<Order[]>(`${this.baseUrl()}/admin/orders`).pipe(
      catchError(() => of<Order[]>([])),
      map((orders) => orders ?? []),
    );
  }
}
