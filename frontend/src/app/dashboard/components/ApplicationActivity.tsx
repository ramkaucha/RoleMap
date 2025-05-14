'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGetWeekApplication } from '@/routes/application';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ApplicationDay {
  date: string;
  applications: number;
}

export default function ApplicationActivity() {
  const [activityTimelineData, setActivityTimelineData] = useState<
    ApplicationDay[]
  >([]);

  const getWeekApplications = useGetWeekApplication();

  useEffect(() => {
    const fetchWeekApplications = async () => {
      try {
        const res = await getWeekApplications.mutateAsync();

        setActivityTimelineData(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWeekApplications();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Activity Timeline</CardTitle>
        <CardDescription>
          Weekly application submission activity
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 mt-8">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activityTimelineData}
              margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                className="text-sm text-black"
              />
              <Tooltip
                contentStyle={{
                  padding: '5px',
                  fontSize: '12px',
                  borderRadius: '4px',
                  boxShadow: '0 2px 5px rgba(0,0,0,15)',
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
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
