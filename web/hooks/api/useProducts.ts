import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Product, PaginatedResponse, ApiResponse } from '@/types/api';
import { toast } from 'react-hot-toast';

export function useProducts(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Product>>(`/products?page=${page}&limit=${limit}`);
      return data;
    },
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: ['products', 'top'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<any[]>>('/analytics/top-products');
      return data.data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await apiClient.post<ApiResponse<Product>>('/products', newProduct);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Product cataloged successfully in database!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updatedProduct }: Partial<Product> & { id: string }) => {
      const { data } = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, updatedProduct);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully in database!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Product deleted successfully from database!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete product');
    },
  });
}
