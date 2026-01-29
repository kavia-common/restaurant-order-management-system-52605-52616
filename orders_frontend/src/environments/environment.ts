export const environment = {
  production: false,

  /**
   * Base URL of the FastAPI backend (e.g., https://...:3001).
   * Set via .env as NG_APP_API_BASE_URL
   */
  apiBaseUrl: (globalThis as any)['process']?.env?.['NG_APP_API_BASE_URL'] ?? '',

  /**
   * Supabase project URL/key. Set via .env as:
   * - NG_APP_SUPABASE_URL
   * - NG_APP_SUPABASE_ANON_KEY
   */
  supabaseUrl: (globalThis as any)['process']?.env?.['NG_APP_SUPABASE_URL'] ?? '',
  supabaseAnonKey: (globalThis as any)['process']?.env?.['NG_APP_SUPABASE_ANON_KEY'] ?? '',

  /**
   * Site URL used for auth redirects (e.g., http://localhost:3000).
   * Set via .env as NG_APP_SITE_URL
   */
  siteUrl: (globalThis as any)['process']?.env?.['NG_APP_SITE_URL'] ?? 'http://localhost:3000',
};
