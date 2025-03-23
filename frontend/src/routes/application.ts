import { BACKEND_URL } from '@/app/config/pages';
import { useMutation } from '@tanstack/react-query';
import { ApplicationFormData } from '@/components/interfaces';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormValues } from '@/app/track/components/application-create-modal';

export const useCreateApplicationMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: FormValues) => {
      const userResponse = await axios.get(`${BACKEND_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const response = await axios.post(
        `${BACKEND_URL}/applications`,
        {
          application: data,
          current_user: userResponse.data,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      router.push('/track');
    },
    onError: (err: any) => {
      let errorMessage =
        err.response?.data?.detail ||
        err.message ||
        'An error occurred during creating application';
      if (errorMessage.length > 1) {
        errorMessage = 'An error occurred during creating application';
      }

      throw new Error(errorMessage);
    },
  });
};

export const getDashboardSummary = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.get(`${BACKEND_URL}/summary`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      return response.data;
    },
    onError: (err: any) => {
      let errorMessage =
        err.response?.data?.detail ||
        err.message ||
        'An error occurred during getting summary';
      if (errorMessage.length > 1) {
        errorMessage = 'An error occurred during getting summary for dashboard';
      }

      throw new Error(errorMessage);
    },
  });
};

// export const getApplicationById = () => {
//   return useMutation({
//     mutationFn: async (id: int) => {
//       const response = await axios.get(`${BACKEND_URL}/applications/${id}`, {
//
//       })
//     }
//   })
// }
