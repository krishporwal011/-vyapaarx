import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Supplier, SupplierAnalytics, PaginatedResponse, ApiResponse } from '@/types/api';

export function useSuppliers({
  page = 1,
  limit = 20,
  search = '',
  status = '',
  sortField = 'createdAt',
  sortOrder = 'desc',
} = {}) {
  return useQuery({
    queryKey: ['suppliers', page, limit, search, status, sortField, sortOrder],
    queryFn: async () => {
      let url = `/suppliers?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (status) url += `&status=${status}`;
      if (sortField) url += `&sortField=${sortField}`;
      if (sortOrder) url += `&sortOrder=${sortOrder}`;

      const { data } = await apiClient.get<PaginatedResponse<Supplier>>(url);
      return data;
    },
  });
}

export function useSupplier(id?: string) {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useSupplierAnalytics() {
  return useQuery({
    queryKey: ['supplier-analytics'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<SupplierAnalytics>>('/suppliers/analytics');
      return data.data;
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newSupplier: Partial<Supplier>) => {
      const { data } = await apiClient.post<ApiResponse<Supplier>>('/suppliers', newSupplier);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-analytics'] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: updateData }: { id: string; data: Partial<Supplier> }) => {
      const { data } = await apiClient.put<ApiResponse<Supplier>>(`/suppliers/${id}`, updateData);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier', data.id] });
      queryClient.invalidateQueries({ queryKey: ['supplier-analytics'] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/suppliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-analytics'] });
    },
  });
}
