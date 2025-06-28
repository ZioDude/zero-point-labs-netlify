import { NextRequest, NextResponse } from 'next/server';
import { findSessionByToken, findClientById } from '@/lib/database';
import type { D1Database } from '@/lib/database';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Get database from Cloudflare Pages binding
    // @ts-ignore - DB is available in Cloudflare runtime
    const db = globalThis.DB || (typeof DB !== 'undefined' ? DB : null);
    
    if (!db) {
      console.error('Database binding not found');
      return NextResponse.json(
        { success: false, message: 'Database connection error' },
        { status: 500 }
      );
    }
    
    // Find session
    const session = await findSessionByToken(token, db);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      );
    }

    // Find client
    const client = await findClientById(session.client_id, db);
    
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      client
    });
    
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
