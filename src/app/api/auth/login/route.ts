import { NextRequest, NextResponse } from 'next/server';
import { findClientByCode, createSession } from '@/lib/database';
import type { D1Database } from '@/lib/database';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { clientCode } = await request.json();

    if (!clientCode) {
      return NextResponse.json(
        { success: false, message: 'Client code is required' },
        { status: 400 }
      );
    }

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

    // Find client by code
    const client = await findClientByCode(clientCode.toUpperCase(), db);
    
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Invalid client code' },
        { status: 401 }
      );
    }

    // Create session
    const session = await createSession(client.id, db);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      client,
      session
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
