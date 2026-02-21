'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelStep } from '@/types/analytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FunnelChartProps {
  data: FunnelStep[];
}

const STEP_LABELS: Record<string, string> = {
  page_view: 'Page Views',
  product_view: 'Product Views',
  add_to_cart: 'Add to Cart',
  checkout_start: 'Checkout',
  purchase: 'Purchase'
};

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function FunnelChart({ data }: FunnelChartProps) {
  const chartData = data.map(step => ({
    name: STEP_LABELS[step.step] || step.step,
    count: step.count,
    dropoff: step.dropoff_rate
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload?.[0]) {
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-semibold">{payload[0].payload.name}</p>
                      <p className="text-sm">Sessions: {payload[0].value}</p>
                      {payload[0].payload.dropoff > 0 && (
                        <p className="text-sm text-red-600">
                          Drop-off: {payload[0].payload.dropoff.toFixed(1)}%
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
