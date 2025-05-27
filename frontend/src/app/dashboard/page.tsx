'use client';

import MetricsList from './components/Metrics';
import ApplicationActivity from './components/ApplicationActivity';
import StatusAndResponseChart from './components/StatusAndResponseChart';
import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ProtectedPageWrapper className="w-full h-full p-4 overflow-y-hidden">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6">👋 Welcome Back, Ram!</h1>
        <div className="mb-6">
          <MetricsList />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ApplicationActivity />
          <StatusAndResponseChart />
        </div>
      </div>
    </ProtectedPageWrapper>
  );
}
