import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = `https://${projectId}.supabase.co`;
  supabaseClient = createSupabaseClient(supabaseUrl, publicAnonKey);
  
  return supabaseClient;
}

export async function callServer(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
    ...options.headers,
  };

  return fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-716ee9da${endpoint}`,
    {
      ...options,
      headers,
    }
  );
}
