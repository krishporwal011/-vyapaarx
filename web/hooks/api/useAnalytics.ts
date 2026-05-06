import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { AnalyticsOverview, ApiResponse } from '@/types/api';

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<AnalyticsOverview>>('/analytics/overview');
      return data.data;
    },
  });
}

export function useAnalyticsRevenue(periodDays: number = 30) {
  return useQuery({
    queryKey: ['analytics', 'revenue', periodDays],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<any[]>>(`/analytics/revenue?period=${periodDays}`);
      return data.data;
    },
  });
}
