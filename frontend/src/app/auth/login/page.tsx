'use client';

import PageWrapper from '@/components/PageWrapper';
import LoginForm from './components/LoginForm';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return null;
  }
  return (
    <PageWrapper>
      <LoginForm />
    </PageWrapper>
  );
}
