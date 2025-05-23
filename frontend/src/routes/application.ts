import { BACKEND_URL } from '@/app/config/pages';
import { useMutation } from '@tanstack/react-query';
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

      console.log(err);

      if (errorMessage.length > 1) {
        errorMessage = 'An error occurred during creating application';
      }

      throw new Error(errorMessage);
    },
  });
};

export const useGetDashboardSummary = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.get(`${BACKEND_URL}/analytics/summary`, {
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

      throw new Error(err);
    },
  });
};

/*
 * Calling backend to get the number of applications for the current week
 */
export const useGetWeekApplication = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.get(`${BACKEND_URL}/analytics/week`, {
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
        'An error occured during getting weekly application numbers';

      if (errorMessage.length > 1) {
        errorMessage =
          'An error occured during getting weekly application numbers';
      }

      throw new Error(err);
    },
  });
};

/*
 * Calling backend to get list of applications
 */
export const useGetApplicationList = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.get(`${BACKEND_URL}/applications`, {
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
        'An error occured during getting the list of applications';

      if (errorMessage.length > 1) {
        errorMessage =
          'An error occured during getting the list of applications';
      }

      throw new Error(err);
    },
  });
};

/**
 *  Getting the status distribution for all applications
 */
export const useGetStatusDistribution = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.get(
        `${BACKEND_URL}/analytics/status-distribution`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      return response.data;
    },
    onError: (err: any) => {
      console.log(err);
      throw new Error(err);
    },
  });
};

export const useCreateMultipleApplicationMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: FormValues[]) => {
      const userResponse = await axios.get(`${BACKEND_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const response = await axios.post(
        `${BACKEND_URL}/applications_multiple`,
        {
          applications: data,
          current_user: userResponse.data,
        },
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      router.refresh();
    },
    onError: (err: any) => {
      // TODO: Error case
      throw new Error(err);
    },
  });
};
