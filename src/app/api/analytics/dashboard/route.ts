import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { DashboardData, FunnelStep, EngagementMetrics } from '@/types/analytics';

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Analytics unavailable' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const shop_id = searchParams.get('shop_id');
    const days = parseInt(searchParams.get('days') || '7');

    if (!shop_id) {
      return NextResponse.json({ error: 'shop_id required' }, { status: 400 });
    }

    const since = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);

    // Funnel calculation
    const funnelData = db.prepare(`
      SELECT 
        event_type,
        COUNT(DISTINCT session_id) as count
      FROM events
      WHERE shop_id = ? AND timestamp >= ?
      GROUP BY event_type
    `).all(shop_id, since) as { event_type: string; count: number }[];

    const stepOrder = ['page_view', 'product_view', 'add_to_cart', 'checkout_start', 'purchase'];
    const funnelMap = new Map(funnelData.map(d => [d.event_type, d.count]));
    
    let previousCount = 0;
    const funnel: FunnelStep[] = stepOrder.map((step, idx) => {
      const count = funnelMap.get(step) || 0;
      const dropoff_rate = idx > 0 && previousCount > 0
        ? ((previousCount - count) / previousCount) * 100
        : 0;
      previousCount = count;
      return { step, count, dropoff_rate };
    });

    // Engagement metrics
    const engagementRaw = db.prepare(`
      SELECT 
        AVG(time_on_page) as avg_time,
        AVG(scroll_depth) as avg_scroll,
        COUNT(DISTINCT session_id) as total_sessions
      FROM events
      WHERE shop_id = ? AND timestamp >= ? AND event_type = 'engagement'
    `).get(shop_id, since) as { avg_time: number | null; avg_scroll: number | null; total_sessions: number } | undefined;

    const bounceData = db.prepare(`
      SELECT COUNT(DISTINCT session_id) as bounced
      FROM events
      WHERE shop_id = ? AND timestamp >= ?
      GROUP BY session_id
      HAVING COUNT(*) = 1
    `).all(shop_id, since);

    const engagement: EngagementMetrics = {
      avg_time_on_page: Math.round(engagementRaw?.avg_time || 0),
      avg_scroll_depth: Math.round(engagementRaw?.avg_scroll || 0),
      bounce_rate: engagementRaw && engagementRaw.total_sessions > 0
        ? (bounceData.length / engagementRaw.total_sessions) * 100
        : 0,
      total_sessions: engagementRaw?.total_sessions || 0
    };

    const response: DashboardData = {
      funnel,
      engagement,
      date_range: {
        start: new Date(since * 1000).toISOString(),
        end: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard query error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
