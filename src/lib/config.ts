/**
 * Environment Configuration for Odon PWA
 * 
 * Create a .env file in the root with these values:
 * 
 * VITE_SUPABASE_URL=https://qwzhdfruxialvfrmyfdh.supabase.co
 * VITE_SUPABASE_ANON_KEY=your_anon_key
 * VITE_GEMINI_API_KEY=your_gemini_key
 * VITE_GOOGLE_CLIENT_ID=your_google_client_id
 * VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
 */

export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  },
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  },
  microsoft: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
  },
  app: {
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  },
};
