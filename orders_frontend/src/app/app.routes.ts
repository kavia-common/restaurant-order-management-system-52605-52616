import { Routes } from '@angular/router';
import { MenuPage } from './pages/menu.page';
import { CartPage } from './pages/cart.page';
import { OrderTrackingPage } from './pages/order-tracking.page';
import { AdminPage } from './pages/admin.page';
import { SignInPage } from './pages/sign-in.page';
import { AuthCallbackPage } from './pages/auth-callback.page';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'menu' },
  { path: 'menu', component: MenuPage },
  { path: 'cart', component: CartPage },
  { path: 'track/:id', component: OrderTrackingPage },
  { path: 'admin', component: AdminPage, canActivate: [adminGuard] },
  { path: 'sign-in', component: SignInPage },
  { path: 'auth/callback', component: AuthCallbackPage },
  { path: '**', redirectTo: 'menu' },
];
