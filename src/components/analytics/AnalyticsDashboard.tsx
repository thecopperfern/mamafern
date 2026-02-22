'use client';

import { useState, useEffect } from 'react';
import { DashboardData } from '@/types/analytics';
import FunnelChart from '@/components/analytics/FunnelChart';
import EngagementSummary from '@/components/analytics/EngagementSummary';
import { Button } from '@/components/ui/button';

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const shop_id = 'mamafern.myshopify.com'; // TODO: Get from auth context
      const res = await fetch(`/api/analytics/dashboard?shop_id=${shop_id}&days=${days}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">No data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <Button
            variant={days === 7 ? 'default' : 'outline'}
            onClick={() => setDays(7)}
          >
            7 Days
          </Button>
          <Button
            variant={days === 30 ? 'default' : 'outline'}
            onClick={() => setDays(30)}
          >
            30 Days
          </Button>
          <Button
            variant={days === 90 ? 'default' : 'outline'}
            onClick={() => setDays(90)}
          >
            90 Days
          </Button>
        </div>
      </div>

      <EngagementSummary data={data.engagement} />
      <FunnelChart data={data.funnel} />

      <div className="text-sm text-gray-500">
        Data from {new Date(data.date_range.start).toLocaleDateString()} to{' '}
        {new Date(data.date_range.end).toLocaleDateString()}
      </div>
    </div>
  );
}
