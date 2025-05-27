'use client';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

export function ProtectedPageWrapper({
  children,
  className = '',
}: {
  children?: ReactNode;
  className?: string;
}) {
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
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={`flex ${className}`}
    >
      {children}
    </motion.div>
  );
}
