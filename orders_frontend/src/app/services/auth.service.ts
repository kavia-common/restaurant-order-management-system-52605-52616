import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Role } from '../models';

export interface AuthState {
  user: User | null;
  role: Role;
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase: SupabaseClient;

  private readonly _state$ = new BehaviorSubject<AuthState>({
    user: null,
    role: 'customer',
    loading: true,
  });

  readonly state$ = this._state$.asObservable();

  constructor() {
    if (!environment.supabaseUrl || !environment.supabaseAnonKey) {
      // Leave supabase unusable but app can run in demo mode.
      this.supabase = createClient('http://invalid.local', 'invalid');
      this._state$.next({ user: null, role: 'customer', loading: false });
      return;
    }

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

    this.init();
  }

  private async init() {
    const { data } = await this.supabase.auth.getSession();
    const user = data.session?.user ?? null;
    this._state$.next({ user, role: this.roleFromUser(user), loading: false });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      this._state$.next({ user: u, role: this.roleFromUser(u), loading: false });
    });
  }

  private roleFromUser(user: User | null): Role {
    // Convention: set app_metadata.role = 'admin' for admins, otherwise customer.
    const role = (user?.app_metadata as any)?.role;
    return role === 'admin' ? 'admin' : 'customer';
  }

  // PUBLIC_INTERFACE
  async signInWithOtp(email: string) {
    /** Starts magic-link sign-in using Supabase (OTP). */
    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${environment.siteUrl}/auth/callback`,
      },
    });
    if (error) throw error;
  }

  // PUBLIC_INTERFACE
  async signOut() {
    /** Signs out the current user. */
    await this.supabase.auth.signOut();
  }

  // PUBLIC_INTERFACE
  getClient(): SupabaseClient {
    /** Returns underlying Supabase client. */
    return this.supabase;
  }
}
