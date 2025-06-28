export interface Client {
  id: string;
  name: string;
  email: string;
  website_url?: string;
  client_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientSession {
  id: string;
  client_id: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}

const SESSION_KEY = 'zpl_client_session';

// Generate secure session token using Web Crypto API (compatible with Edge Runtime)
function generateSessionToken(): string {
  // Use crypto.getRandomValues which is available in Edge Runtime
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Check if user is authenticated (client-side)
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return false;
  
  try {
    const { token, expires_at, client } = JSON.parse(sessionData);
    const isValid = token && new Date(expires_at) > new Date() && client;
    
    if (!isValid) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    
    return true;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return false;
  }
}

// Get current client from session
export function getCurrentClient(): Client | null {
  if (typeof window === 'undefined') return null;
  
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;
  
  try {
    const { client, expires_at } = JSON.parse(sessionData);
    
    if (new Date(expires_at) <= new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    
    return client;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

// Login with client code
export async function login(clientCode: string): Promise<{ success: boolean; message: string; client?: Client }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientCode }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Store session data in localStorage
      const sessionData = {
        token: result.session.session_token,
        expires_at: result.session.expires_at,
        client: result.client
      };
      
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      
      return {
        success: true,
        message: 'Login successful',
        client: result.client
      };
    } else {
      return {
        success: false,
        message: result.message || 'Login failed'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
}

// Logout
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '/';
  }
}

// Get session token for API calls
export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;
  
  try {
    const { token, expires_at } = JSON.parse(sessionData);
    
    if (new Date(expires_at) <= new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    
    return token;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

// Validate session token server-side
export async function validateSession(token: string): Promise<Client | null> {
  try {
    const response = await fetch('/api/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.ok) {
      const result = await response.json();
      return result.client;
    }
    
    return null;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

// Server-side session validation for API routes
export async function getClientFromRequest(request: Request): Promise<Client | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    // Import database functions dynamically to avoid circular dependencies
    const { findSessionByToken, findClientById } = await import('./database');
    
    // Get database from Cloudflare Pages binding
    // @ts-ignore - DB is available in Cloudflare runtime
    const db = globalThis.DB || (typeof DB !== 'undefined' ? DB : null);
    
    if (!db) {
      console.error('Database binding not found in getClientFromRequest');
      return null;
    }
    
    // Find session by token
    const session = await findSessionByToken(token, db);
    if (!session) {
      return null;
    }
    
    // Find client by ID
    const client = await findClientById(session.client_id, db);
    return client;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}
