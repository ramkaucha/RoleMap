'use client';

import { useGetDashboardSummary } from '@/routes/application';
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const exampleMetrics = [
  {
    name: 'Total Applications',
    number: 19,
    change: '10',
    isPositive: true,
    description: 'Trending up',
  },
  {
    name: 'Active Applications',
    number: 10,
    change: '-10',
    isPositive: false,
    description: 'Trending Down',
  },
  {
    name: 'Response Rate',
    number: 2,
    change: '10',
    isPositive: true,
    description: 'Trending up',
  },
  {
    name: 'Interview Rate',
    number: 12,
    change: '10',
    isPositive: true,
    description: 'Trending up',
  },
  {
    name: 'Offer Rate',
    number: 2,
    change: '10',
    isPositive: true,
    description: 'Trending up',
  },
];

export default function MetricsList() {
  const [metrics, setMetrics] = useState(exampleMetrics);

  const getDashboardSummary = useGetDashboardSummary();

  useEffect(() => {
    const data = getDashboardSummary.mutateAsync();

    console.log(data);
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
