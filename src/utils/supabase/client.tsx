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

// Helper function to create a timeout promise
function createTimeoutPromise(ms: number, errorMessage: string = 'Request timeout') {
  return new Promise((_, reject) => 
    setTimeout(() => reject(new Error(errorMessage)), ms)
  );
}

export async function callServer(
  endpoint: string,
  options: RequestInit = {},
  timeout: number = 5000
): Promise<Response> {
  try {
    const supabase = createClient();
    
    // Add timeout to getSession
    const sessionPromise = supabase.auth.getSession();
    const { data: { session } } = await Promise.race([
      sessionPromise,
      createTimeoutPromise(2000, 'Session fetch timeout')
    ]) as any;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
      ...options.headers,
    };

    const fetchPromise = fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-716ee9da${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    // Add timeout to the fetch request
    return await Promise.race([
      fetchPromise,
      createTimeoutPromise(timeout, 'Server request timeout')
    ]) as Response;
  } catch (error) {
    console.debug('callServer error:', error);
    throw error;
  }
}