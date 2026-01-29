import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, MenuItem } from '../models';

const STORAGE_KEY = 'roms_cart_v1';

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items$ = new BehaviorSubject<CartItem[]>(
    safeParseCart(typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null),
  );

  readonly items$ = this._items$.asObservable();

  private persist(items: CartItem[]) {
    this._items$.next(items);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }

  // PUBLIC_INTERFACE
  getSnapshot(): CartItem[] {
    /** Returns current cart items. */
    return this._items$.value;
  }

  // PUBLIC_INTERFACE
  getCount(): number {
    /** Returns total quantity across cart. */
    return this._items$.value.reduce((sum, i) => sum + i.quantity, 0);
  }

  // PUBLIC_INTERFACE
  add(menuItem: MenuItem, quantity: number = 1) {
    /** Adds an item to cart or increases quantity. */
    const items = [...this._items$.value];
    const existing = items.find((i) => i.menuItem.id === menuItem.id);
    if (existing) existing.quantity += quantity;
    else items.push({ menuItem, quantity });
    this.persist(items);
  }

  // PUBLIC_INTERFACE
  setQuantity(menuItemId: string, quantity: number) {
    /** Sets quantity for a given menu item; removes when quantity <= 0. */
    const next = this._items$.value
      .map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i))
      .filter((i) => i.quantity > 0);
    this.persist(next);
  }

  // PUBLIC_INTERFACE
  clear() {
    /** Clears cart contents. */
    this.persist([]);
  }

  // PUBLIC_INTERFACE
  totalCents(): number {
    /** Calculates total in cents. */
    return this._items$.value.reduce((sum, i) => sum + i.menuItem.priceCents * i.quantity, 0);
  }
}
