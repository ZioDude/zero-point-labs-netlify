import { NextRequest, NextResponse } from 'next/server';
import { getFormSubmissions } from '@/lib/database';
import { getClientFromRequest } from '@/lib/auth';
import type { D1Database } from '@/lib/database';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Validate authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const client = await getClientFromRequest(new Request(request.url, {
      headers: { 'Authorization': `Bearer ${token}` }
    }));

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
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

    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const status = url.searchParams.get('status');

    // Get form submissions
    let submissions = await getFormSubmissions(client.id, limit, db);

    // Filter by status if provided
    if (status && status !== 'all') {
      submissions = submissions.filter(sub => sub.status === status);
    }

    return NextResponse.json({
      success: true,
      submissions,
      total: submissions.length
    });
    
  } catch (error) {
    console.error('Submissions fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
