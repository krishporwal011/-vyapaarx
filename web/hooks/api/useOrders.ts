import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Order, PaginatedResponse, ApiResponse } from '@/types/api';
import { toast } from 'react-hot-toast';

export function useOrders(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['orders', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Order>>(`/orders?page=${page}&limit=${limit}`);
      return data;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newOrder: {
      customer: string;
      items: Array<{ product: string; quantity: number; price: number; tax: number; gstRate?: number }>;
      totalAmount: number;
      taxAmount: number;
      status?: string;
      paymentStatus?: string;
    }) => {
      const { data } = await apiClient.post<ApiResponse<Order>>('/orders', newOrder);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Sales order created successfully in PostgreSQL!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create sales order');
    },
  });
}
