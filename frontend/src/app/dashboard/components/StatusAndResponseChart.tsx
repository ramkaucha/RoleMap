'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useGetStatusDistribution } from '@/routes/application';

const statusDistributionData = [
  { name: 'Applied', value: 35 },
  { name: 'Screening', value: 20 },
  { name: 'Interview', value: 15 },
  { name: 'Rejected', value: 25 },
  { name: 'Offer', value: 5 },
];

const responseTimeData = [
  { name: 'Tech', days: 6 },
  { name: 'Finance', days: 8 },
  { name: 'Healthcare', days: 4 },
  { name: 'Manufacturing', days: 10 },
  { name: 'Retail', days: 7 },
];

interface StatusDistribution {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function StatusAndResponseChart() {
  const [rightChartTab, setRightChartTab] = useState('status');
  const [statusDistribution, setStatusDistribution] = useState<
    StatusDistribution[]
  >([]);

  const getStatusDistribution = useGetStatusDistribution();
  useEffect(() => {
    const fetchStatusDistribution = async () => {
      try {
        const response = await getStatusDistribution.mutateAsync();

        setStatusDistribution(response);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatusDistribution();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Analytics</CardTitle>
        <CardDescription>
          Detailed insights into your job applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status" onValueChange={setRightChartTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="status">Status Distribution</TabsTrigger>
            <TabsTrigger value="response">Response Time</TabsTrigger>
          </TabsList>
          <TabsContent value="status" className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  fill="#8884d8"
                  dataKey="value"
                  // label={({ name, percent }) =>
                  //   `${name}: ${(percent * 100).toFixed(0)}%`
                  // }
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} applications`, 'Count']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="response" className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={responseTimeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
                />
                <Legend />
                <Bar dataKey="days" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center space-x-2 mt-4">
          <div
            className={`h-2 w-2 rounded-full ${rightChartTab === 'status' ? 'bg-primary' : 'bg-gray-300'}`}
            onClick={() => setRightChartTab('status')}
          ></div>
          <div
            className={`h-2 w-2 rounded-full ${rightChartTab === 'response' ? 'bg-primary' : 'bg-gray-300'}`}
            onClick={() => setRightChartTab('response')}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
}
