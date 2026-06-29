import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Customer, PaginatedResponse, ApiResponse } from '@/types/api';
import { toast } from 'react-hot-toast';

export function useCustomers(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['customers', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Customer>>(`/customers?page=${page}&limit=${limit}`);
      return data;
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCustomer: Omit<Customer, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await apiClient.post<ApiResponse<Customer>>('/customers', newCustomer);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Customer registered successfully in database!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create customer');
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updatedCustomer }: Partial<Customer> & { id: string }) => {
      const { data } = await apiClient.put<ApiResponse<Customer>>(`/customers/${id}`, updatedCustomer);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer profile updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update customer');
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Customer deleted successfully from database!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete customer');
    },
  });
}
