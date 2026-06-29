import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useCashbook() {
  return useQuery({
    queryKey: ['cashbook'],
    queryFn: async () => {
      const { data } = await apiClient.get('/cashbook');
      return data.data;
    },
  });
}

export function useCreateCashbookEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: any) => {
      const { data } = await apiClient.post('/cashbook', entry);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashbook'] });
    },
  });
}

export function useDeleteCashbookEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/cashbook/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashbook'] });
    },
  });
}
