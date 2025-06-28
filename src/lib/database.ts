// Database utilities for Cloudflare D1
import { Client, ClientSession } from './auth';

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1Result[]>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

export interface D1Result<T = Record<string, unknown>> {
  success: boolean;
  meta: {
    duration: number;
    changes: number;
    last_row_id: number;
  };
  results?: T[];
}

// Generate unique ID
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${prefix}${timestamp}${randomString}`;
}

// Client operations
export async function findClientByCode(clientCode: string, db: D1Database): Promise<Client | null> {
  const stmt = db.prepare(
    'SELECT * FROM clients WHERE client_code = ? AND is_active = 1'
  ).bind(clientCode);
  
  const result = await stmt.first<Client>();
  return result || null;
}

export async function findClientById(clientId: string, db: D1Database): Promise<Client | null> {
  const stmt = db.prepare(
    'SELECT * FROM clients WHERE id = ? AND is_active = 1'
  ).bind(clientId);
  
  const result = await stmt.first<Client>();
  return result || null;
}

export async function createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>, db: D1Database): Promise<Client> {
  const id = generateId('client-');
  const now = new Date().toISOString();
  
  const stmt = db.prepare(
    `INSERT INTO clients (id, name, email, website_url, client_code, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, client.name, client.email, client.website_url || null, client.client_code, client.is_active ? 1 : 0, now, now);
  
  await stmt.run();
  
  return {
    id,
    ...client,
    created_at: now,
    updated_at: now
  };
}

// Session operations
export async function createSession(clientId: string, db: D1Database): Promise<ClientSession> {
  const id = generateId('session-');
  const sessionToken = generateId('token-');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
  const now = new Date().toISOString();
  
  const stmt = db.prepare(
    `INSERT INTO client_sessions (id, client_id, session_token, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(id, clientId, sessionToken, expiresAt, now);
  
  await stmt.run();
  
  return {
    id,
    client_id: clientId,
    session_token: sessionToken,
    expires_at: expiresAt,
    created_at: now
  };
}

export async function findSessionByToken(token: string, db: D1Database): Promise<ClientSession | null> {
  const stmt = db.prepare(
    'SELECT * FROM client_sessions WHERE session_token = ? AND expires_at > datetime("now")'
  ).bind(token);
  
  const result = await stmt.first<ClientSession>();
  return result || null;
}

export async function deleteExpiredSessions(db: D1Database): Promise<void> {
  const stmt = db.prepare(
    'DELETE FROM client_sessions WHERE expires_at <= datetime("now")'
  );
  
  await stmt.run();
}

// Form submission operations
export interface FormSubmission {
  id: string;
  client_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message?: string;
  urgency: string;
  status: string;
  source_url?: string;
}

export async function createFormSubmission(
  clientId: string, 
  submission: Omit<FormSubmission, 'id' | 'client_id' | 'created_at' | 'updated_at'>,
  db: D1Database
): Promise<FormSubmission> {
  const id = generateId('sub-');
  const now = new Date().toISOString();
  
  const stmt = db.prepare(
    `INSERT INTO form_submissions 
     (id, client_id, created_at, updated_at, name, email, phone, service, message, urgency, status, source_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, clientId, now, now, 
    submission.name, submission.email, submission.phone || null,
    submission.service, submission.message || null, submission.urgency,
    submission.status, submission.source_url || null
  );
  
  await stmt.run();
  
  return {
    id,
    client_id: clientId,
    created_at: now,
    updated_at: now,
    ...submission
  };
}

export async function getFormSubmissions(clientId: string, limit: number = 50, db: D1Database): Promise<FormSubmission[]> {
  const stmt = db.prepare(
    'SELECT * FROM form_submissions WHERE client_id = ? ORDER BY created_at DESC LIMIT ?'
  ).bind(clientId, limit);
  
  const result = await stmt.all<FormSubmission>();
  return result.results || [];
}

// Analytics operations
export interface AnalyticsData {
  id: string;
  client_id: string;
  date: string;
  visitors_count: number;
  page_views_count: number;
  submissions_count: number;
  bounce_rate: number;
  avg_session_duration: number;
  top_pages: string;
  traffic_sources: string;
  device_types: string;
  created_at: string;
  updated_at: string;
}

export async function getAnalyticsData(clientId: string, days: number = 7, db: D1Database): Promise<AnalyticsData[]> {
  const stmt = db.prepare(
    `SELECT * FROM analytics_data 
     WHERE client_id = ? AND date >= date('now', '-${days} days')
     ORDER BY date DESC`
  ).bind(clientId);
  
  const result = await stmt.all<AnalyticsData>();
  return result.results || [];
}

export async function upsertAnalyticsData(
  clientId: string, 
  date: string, 
  data: Partial<Omit<AnalyticsData, 'id' | 'client_id' | 'date' | 'created_at' | 'updated_at'>>,
  db: D1Database
): Promise<void> {
  const now = new Date().toISOString();
  const id = generateId('analytics-');
  
  const stmt = db.prepare(
    `INSERT OR REPLACE INTO analytics_data 
     (id, client_id, date, visitors_count, page_views_count, submissions_count, 
      bounce_rate, avg_session_duration, top_pages, traffic_sources, device_types, 
      created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, clientId, date,
    data.visitors_count || 0,
    data.page_views_count || 0,
    data.submissions_count || 0,
    data.bounce_rate || 0,
    data.avg_session_duration || 0,
    data.top_pages || '[]',
    data.traffic_sources || '[]',
    data.device_types || '[]',
    now, now
  );
  
  await stmt.run();
} 