"use client";

import { useState } from "react";

const exampleMetrics = [
  {
    "name": "Total Applications",
    "number": 19
  },
  {
    "name": "Active Applications",
    "number": 10
  },
  {
    "name": "Response Rate",
    "number": 2
  },
  {
    "name": "Interview Rate",
    "number": 12
  },
  {
    "name": "Offer Rate",
    "number": 2
  }
];

export default function MetricsList() {
  const [metrics, setMetrics] = useState(exampleMetrics);
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((item) => (
          <div key={item.name} className="border rounded-xl shadow-sm">
            <div className="aspect-[3/2] w-full flex flex-col items-center justify-center p-2 text-center">
              <span className="text-sm font-medium text-muted-foreground mb-2">{item.name}</span>
              <span className="text-2xl font-bold">{item.number}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
