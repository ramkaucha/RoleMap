'use client';

import { useEffect, useState } from 'react';
import ApplicationTable from './application-table';
import { Application } from '@/components/type/application';
import { generateSampleApplications } from './generateSampleApplications';

const sampleApplications = generateSampleApplications();

export default function ApplicationPage() {
  const [data, setData] = useState<Application[]>([]);

  useEffect(() => {
    setData(sampleApplications);
  }, []);

  return (
    <div className="w-full">
      <ApplicationTable data={data} setData={setData} />
    </div>
  );
}
