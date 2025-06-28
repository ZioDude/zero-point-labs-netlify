import { NextRequest, NextResponse } from 'next/server';
import { findClientByCode, upsertAnalyticsData, createFormSubmission } from '@/lib/database';
import type { D1Database } from '@/lib/database';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { clientCode, type, data } = await request.json();

    if (!clientCode || !type || !data) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
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

    const today = new Date().toISOString().split('T')[0];

    switch (type) {
      case 'page_view':
        // Track page view
        await upsertAnalyticsData(client.id, today, {
          page_views_count: (data.count || 1)
        }, db);
        break;

      case 'visitor':
        // Track visitor
        await upsertAnalyticsData(client.id, today, {
          visitors_count: (data.count || 1)
        }, db);
        break;

      case 'form_submission':
        // Track form submission
        await createFormSubmission(client.id, {
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          message: data.message,
          urgency: data.urgency || 'flexible',
          status: 'new',
          source_url: data.source_url
        }, db);
        
        // Also update daily count
        await upsertAnalyticsData(client.id, today, {
          submissions_count: 1
        }, db);
        break;

      case 'analytics_bulk':
        // Bulk analytics update
        await upsertAnalyticsData(client.id, today, {
          visitors_count: data.visitors_count || 0,
          page_views_count: data.page_views_count || 0,
          submissions_count: data.submissions_count || 0,
          bounce_rate: data.bounce_rate || 0,
          avg_session_duration: data.avg_session_duration || 0,
          top_pages: JSON.stringify(data.top_pages || []),
          traffic_sources: JSON.stringify(data.traffic_sources || []),
          device_types: JSON.stringify(data.device_types || [])
        }, db);
        break;

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid tracking type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Data tracked successfully'
    });
    
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// CORS headers for cross-origin requests from client sites
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
