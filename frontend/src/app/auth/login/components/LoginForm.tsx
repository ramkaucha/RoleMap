'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import EnhancedInput from '@/components/enhanced-input';
import { useState } from 'react';
import { LoginFormData } from '@/components/interfaces';
import ErrorAlert from '@/components/error-alert';
import Link from 'next/link';
import { useLoginMutation } from '@/routes/auth';
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const loginMutation = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      loginMutation.mutateAsync(formData);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex justify-center items-center max-h-screen">
        <Loader2 className="h-20 w-20 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col w-full">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      <Card className="w-full px-8">
        <CardHeader>
          <CardTitle className="text-3xl">Login</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Email</Label>
            <EnhancedInput
              id="username"
              type="email"
              name="username"
              required
              placeholder="me@example.com"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/reset-password"
                className="text-sm text-blue-700 underline"
              >
                Forgot Password?
              </Link>
            </div>
            <EnhancedInput
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <Link href="/auth/register" className="text-sm">
              Don't have an Account?{' '}
              <span className="text-blue-700 underline">Sign Up Here.</span>
            </Link>
          </div>
          <Button
            type="submit"
            variant="default"
            onClick={handleSubmit}
            className="w-full font-semibold"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging In...' : 'Login'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
