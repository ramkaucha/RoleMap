import { BACKEND_URL } from "@/app/config/pages";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";


/**
 * Hook for obtaining user information
 *
 * Returns mutation object from React Query that returns the user information,
 * including making the API request, handling success and error states and managing redirects
 * @returns {UseMutationResult<any, Error, User, unknown>} mutation object
 */
export const useGetUser = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.get(`${BACKEND_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      return response.data;
    },
    onError: (err: any) => {
      console.error(err);
    }
  })
}