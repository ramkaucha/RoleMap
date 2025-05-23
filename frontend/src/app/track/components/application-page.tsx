'use client';

import { useEffect, useState } from 'react';
import ApplicationTable from './application-table';
import { Application } from '@/components/type/application';
import { generateSampleApplications } from './generateSampleApplications';

import { useGetApplicationList } from '@/routes/application';

export default function ApplicationPage() {
  const [data, setData] = useState<Application[]>([]);

  const getApplicationList = useGetApplicationList();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getApplicationList.mutateAsync();

        setData(res.items);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApplications();
  }, []);

  // TODO: if setData changes, we update the data from here

  return (
    <div className="w-full min-h-screen">
      <ApplicationTable data={data} setData={setData} />
    </div>
  );
}
