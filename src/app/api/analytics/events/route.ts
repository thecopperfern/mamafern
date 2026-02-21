import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { AnalyticsEvent } from '@/types/analytics';

export async function POST(req: NextRequest) {
  try {
    const event: AnalyticsEvent = await req.json();

    // Validation
    if (!event.shop_id || !event.session_id || !event.event_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert event
    const stmt = db.prepare(`
      INSERT INTO events (
        shop_id, session_id, event_type, timestamp,
        page_url, referrer, device_type, user_agent,
        scroll_depth, time_on_page, product_id, cart_value, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      event.shop_id,
      event.session_id,
      event.event_type,
      event.timestamp,
      event.page_url || null,
      event.referrer || null,
      event.device_type || null,
      event.user_agent || null,
      event.scroll_depth || null,
      event.time_on_page || null,
      event.product_id || null,
      event.cart_value || null,
      event.metadata ? JSON.stringify(event.metadata) : null
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event ingestion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
