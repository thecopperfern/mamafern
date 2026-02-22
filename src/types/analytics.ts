export type EventType = 
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'checkout_start'
  | 'purchase'
  | 'engagement';

export interface AnalyticsEvent {
  shop_id: string;
  session_id: string;
  event_type: EventType;
  timestamp: number;
  page_url?: string;
  referrer?: string;
  device_type?: 'mobile' | 'tablet' | 'desktop';
  user_agent?: string;
  scroll_depth?: number;
  time_on_page?: number;
  product_id?: string;
  cart_value?: number;
  metadata?: Record<string, unknown>;
}

export interface FunnelStep {
  step: string;
  count: number;
  dropoff_rate: number;
}

export interface EngagementMetrics {
  avg_time_on_page: number;
  avg_scroll_depth: number;
  bounce_rate: number;
  total_sessions: number;
}

export interface DashboardData {
  funnel: FunnelStep[];
  engagement: EngagementMetrics;
  date_range: { start: string; end: string };
}
