'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EngagementMetrics } from '@/types/analytics';
import { Clock, MousePointer, TrendingDown, Users } from 'lucide-react';

interface EngagementSummaryProps {
  data: EngagementMetrics;
}

export default function EngagementSummary({ data }: EngagementSummaryProps) {
  const metrics = [
    {
      label: 'Avg Time on Page',
      value: `${data.avg_time_on_page}s`,
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      label: 'Avg Scroll Depth',
      value: `${data.avg_scroll_depth}%`,
      icon: MousePointer,
      color: 'text-green-600'
    },
    {
      label: 'Bounce Rate',
      value: `${data.bounce_rate.toFixed(1)}%`,
      icon: TrendingDown,
      color: 'text-red-600'
    },
    {
      label: 'Total Sessions',
      value: data.total_sessions.toLocaleString(),
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
