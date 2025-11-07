import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  try {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    supabaseClient = createSupabaseClient(supabaseUrl, publicAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        headers: {}
      }
    });
    
    return supabaseClient;
  } catch (error) {
    console.debug('Failed to create Supabase client:', error);
    // Return a minimal client that won't cause errors
    return null as any;
  }
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
    
    // If client creation failed, return error response immediately
    if (!supabase) {
      return new Response(
        JSON.stringify({ 
          error: 'Backend unavailable',
          message: 'Service is currently unavailable'
        }), 
        { 
          status: 503, 
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Add timeout to getSession with graceful fallback
    let session = null;
    try {
      const sessionPromise = supabase.auth.getSession();
      const result = await Promise.race([
        sessionPromise,
        createTimeoutPromise(2000, 'Session fetch timeout')
      ]) as any;
      session = result?.data?.session;
    } catch (sessionError) {
      // Silently fail - we'll use anon key
      console.debug('Session fetch failed, using anon key:', sessionError);
    }
    
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
    const response = await Promise.race([
      fetchPromise,
      createTimeoutPromise(timeout, 'Server request timeout')
    ]) as Response;
    
    return response;
  } catch (error) {
    // Return a mock error response instead of throwing
    console.debug('callServer error (backend unavailable):', error);
    
    // Return a failed Response object instead of throwing
    return new Response(
      JSON.stringify({ 
        error: 'Backend unavailable',
        message: 'Service is currently unavailable'
      }), 
      { 
        status: 503, 
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
