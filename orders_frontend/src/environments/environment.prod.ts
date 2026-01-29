export const environment = {
  production: true,
  apiBaseUrl: (globalThis as any)['process']?.env?.['NG_APP_API_BASE_URL'] ?? '',
  supabaseUrl: (globalThis as any)['process']?.env?.['NG_APP_SUPABASE_URL'] ?? '',
  supabaseAnonKey: (globalThis as any)['process']?.env?.['NG_APP_SUPABASE_ANON_KEY'] ?? '',
  siteUrl: (globalThis as any)['process']?.env?.['NG_APP_SITE_URL'] ?? '',
};
