'use client';

import TypeWriter from '@/components/TypeWriter';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      <div className="flex flex-col gap-6 p-6 items-center z-10 mt-16">
        <div>
          <TypeWriter
            text={['Track Your Role Smarter.', 'Map your Interviews Better.']}
            speed={80}
            delay={200}
            loop={true}
            className="text-8xl font-bold text-center"
          />
        </div>
        <div>
          <p className="text-xl font-light text-center max-w-2xl">
            Track your applications like never before.
          </p>
        </div>
        <Button
          variant="secondary"
          className="text-md bg-orange-500 mt-2"
          onClick={() => router.push('/auth/register')}
        >
          Get Started!
        </Button>
      </div>
      <div className="bottom-0 left-0 w-full flex justify-center">
        <img src="/Pattern.png" alt="Hero Picture" />
      </div>
    </div>
  );
}
