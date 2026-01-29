export type Role = 'customer' | 'admin';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  priceCents: number;
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  totalCents: number;
  customerName?: string;
  customerPhone?: string;
}

export interface CreateOrderRequest {
  customerName?: string;
  customerPhone?: string;
  items: Array<{ menuItemId: string; quantity: number }>;
}

export interface CreateOrderResponse {
  orderId: string;
}
