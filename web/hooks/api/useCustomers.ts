import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Customer, PaginatedResponse } from '@/types/api';

export function useCustomers(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['customers', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Customer>>(`/customers?page=${page}&limit=${limit}`);
      return data;
    },
  });
}
