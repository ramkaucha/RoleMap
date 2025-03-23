import { BACKEND_URL } from '@/app/config/pages';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { LoginFormData, RegisterFormData } from '@/components/interfaces';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * Hook for handling user login.
 *
 * Returns mutation object from React Query that handles the login process,
 * including making the API request, handling success and error states and managing redirects
 * @returns {UseMutationResult<any, Error, LoginFormData, unknown>} mutation object
 */
export const useLoginMutation = () => {
  const router = useRouter();
  const { login } = useAuth();
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const formData = new URLSearchParams({
        username: data.username,
        password: data.password,
      });

      const response = await axios.post(`${BACKEND_URL}/auth/token`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        withCredentials: false,
      });

      return response.data;
    },
    onSuccess: (data) => {
      login(data.access_token);
      router.push('/dashboard');
    },
    onError: (error: any) => {
      let errorMessage =
        error.response?.data?.detail ||
        error.message ||
        'An error occurred during login.';
      if (errorMessage.length > 1) {
        errorMessage = 'An error occurred during login';
      }

      throw new Error(errorMessage);
    },
  });
};

/**
 * Hook for handling user registration.
 *
 * Returns mutation object from React Query that handles the registration process,
 * including making the API request, handling success and error states and managing redirects
 * @returns {UseMutationResult<any, Error, RegisterFormData, unknown>} mutation object
 */
export const useRegistrationMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await axios.post(`${BACKEND_URL}/auth/register`, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: false,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      sessionStorage.setItem('registration_email', variables.email);
      sessionStorage.setItem('registration_timestamp', Date.now().toString());
      router.push(`/auth/verify?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: any) => {
      let errorMessage =
        error.response?.data?.detail ||
        error.message ||
        'An error occurred during registration';

      if (errorMessage.length > 1) {
        errorMessage = 'An error occurred during registration';
      }

      throw new Error(errorMessage);
    },
  });
};
