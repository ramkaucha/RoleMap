'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const activityTimelineData = [
 { week: 'Jun 1', applications: 5 },
 { week: 'Jun 2', applications: 8 },
 { week: 'Jun 3', applications: 12 },
 { week: 'Jun 4', applications: 6 },
 { week: 'Jun 5', applications: 9 },
 { week: 'Jun 6', applications: 11 },
 { week: 'Jun 7', applications: 15 },
 { week: 'Jun 8', applications: 10 },
];

export default function ApplicationActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Activity Timeline</CardTitle>
        <CardDescription>Weekly application submission activity</CardDescription>
      </CardHeader>
      <CardContent className="p-0 mt-8">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activityTimelineData}
              margin={{ top: 5, right: 30, left: 30, bottom: 5}}
            >
              <XAxis dataKey="week" tickLine={false} axisLine={false} className="text-sm text-black"/>
              <Tooltip
                contentStyle={{
                  padding: '5px',
                  fontSize: '12px',
                  borderRadius: '4px',
                  boxShadow: '0 2px 5px rgba(0,0,0,15)'
                }}
                itemStyle={{ padding: '2px 0' }}
                labelStyle={{ marginBottom: '2px' }}
              />
              <Area
                type="monotone"
                dataKey="applications"
                stroke="#006400"
                fill="#006400"
                fillOpacity={0.3}
                strokeWidth={2}
                activeDot={{ r: 8}}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}