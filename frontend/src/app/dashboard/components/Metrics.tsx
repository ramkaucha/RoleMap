'use client';

import { useGetDashboardSummary } from '@/routes/application';
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ApplicationStats {
  active_applications: number;
  applications_this_month: number;
  interview_rate: number;
  response_rate: number;
  total_applications: number;
}

interface Metric {
  name: string;
  number: number;
  change: string;
  isPositive: boolean;
  description: string;
}

const applySummary = (result: ApplicationStats) => {
  const metric: Metric[] = [
    {
      name: 'Total Applications',
      number: result.total_applications,
      change: '10',
      isPositive: true,
      description: 'Trending up',
    },
    {
      name: 'Active Applications',
      number: result.active_applications,
      change: '-10',
      isPositive: false,
      description: 'Trending Down',
    },
    {
      name: 'Response Rate',
      number: result.response_rate,
      change: '10',
      isPositive: true,
      description: 'Trending up',
    },
    {
      name: 'Interview Rate',
      number: result.interview_rate,
      change: '10',
      isPositive: true,
      description: 'Trending up',
    },
    {
      name: 'Application This Month',
      number: result.applications_this_month,
      change: '10',
      isPositive: true,
      description: 'Trending up',
    },
  ];

  return metric;
};

export default function MetricsList() {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  const getDashboardSummary = useGetDashboardSummary();

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const res = await getDashboardSummary.mutateAsync();

        const metric = applySummary(res);
        setMetrics(metric);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboardSummary();
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((item) => (
          <div key={item.name} className="border rounded-xl shadow-sm">
            <div className="aspect-[4/2] w-full flex flex-col p-2 text-center items-start mb-2">
              <span className="text-sm p-2 font-medium text-muted-foreground mb-2">
                {item.name}
              </span>
              <span className="text-4xl ml-2 font-bold">{item.number}</span>
              <div className="flex justify-between flex-row items-center w-full mt-4 p-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  {item.description}
                  {item.isPositive === true ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </span>
                <span
                  className={`text-sm border-1 border-b-2 flex items-center font-semibold
                  ${item.isPositive === true ? 'text-green-500' : 'text-red-500'}`}
                >
                  {item.change} %
                  {item.isPositive === true ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
