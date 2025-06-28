import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsData, getFormSubmissions } from '@/lib/database';
import { getClientFromRequest } from '@/lib/auth';
import type { D1Database } from '@/lib/database';

export const runtime = 'edge';

interface AnalyticsSummary {
  totalVisitors: number;
  totalFormSubmissions: number;
  totalPageViews: number;
  recentSubmissions: any[];
  visitorsByDay: { date: string; count: number }[];
  submissionsByDay: { date: string; count: number }[];
  topPages: { page: string; count: number }[];
  topSources: { source: string; count: number }[];
}

function getLast7Days(): string[] {
  const days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  
  return days;
}

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

    // Get analytics data
    const analyticsData = await getAnalyticsData(client.id, 7, db);
    const formSubmissions = await getFormSubmissions(client.id, 10, db);
    const last7Days = getLast7Days();

    // Calculate totals
    const totalVisitors = analyticsData.reduce((sum, day) => sum + day.visitors_count, 0);
    const totalPageViews = analyticsData.reduce((sum, day) => sum + day.page_views_count, 0);
    const totalFormSubmissions = formSubmissions.length;

    // Format data for dashboard
    const summary: AnalyticsSummary = {
      totalVisitors,
      totalFormSubmissions,
      totalPageViews,
      recentSubmissions: formSubmissions.slice(0, 5),
      visitorsByDay: last7Days.map(day => {
        const dayData = analyticsData.find(a => a.date === day);
        return { date: day, count: dayData?.visitors_count || 0 };
      }),
      submissionsByDay: last7Days.map(day => {
        const count = formSubmissions.filter(sub => 
          sub.created_at.split('T')[0] === day
        ).length;
        return { date: day, count };
      }),
      topPages: [], // Will be implemented with page tracking
      topSources: [] // Will be implemented with source tracking
    };

    return NextResponse.json({
      success: true,
      analytics: summary
    });
    
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
