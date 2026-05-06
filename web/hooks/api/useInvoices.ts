import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Invoice, InvoiceAnalytics, PaginatedResponse, ApiResponse } from '@/types/api';

export function useInvoices({
  page = 1,
  limit = 10,
  status = '',
  paymentStatus = '',
  customerId = '',
  search = '',
} = {}) {
  return useQuery({
    queryKey: ['invoices', page, limit, status, paymentStatus, customerId, search],
    queryFn: async () => {
      let url = `/invoices?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      if (paymentStatus) url += `&paymentStatus=${paymentStatus}`;
      if (customerId) url += `&customerId=${customerId}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const { data } = await apiClient.get<PaginatedResponse<Invoice>>(url);
      return data;
    },
  });
}

export function useInvoice(id?: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await apiClient.get<ApiResponse<Invoice>>(`/invoices/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useInvoiceAnalytics() {
  return useQuery({
    queryKey: ['invoice-analytics'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<InvoiceAnalytics>>('/invoices/analytics');
      return data.data;
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newInvoice: any) => {
      const { data } = await apiClient.post<ApiResponse<Invoice>>('/invoices', newInvoice);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-analytics'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: updateData }: { id: string; data: any }) => {
      const { data } = await apiClient.put<ApiResponse<Invoice>>(`/invoices/${id}`, updateData);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] });
      queryClient.invalidateQueries({ queryKey: ['invoice-analytics'] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-analytics'] });
    },
  });
}
