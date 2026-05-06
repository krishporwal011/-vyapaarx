import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface StockPrediction {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  threshold: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  monthlyVelocity: number;
  daysToEmpty: number;
  recommendedReorder: number;
}

export interface DeadInventory {
  name: string;
  sku: string;
  currentStock: number;
}

export interface FastMoving {
  name: string;
  sku: string;
  quantitySold: number;
}

export interface AiForecasts {
  lowStockPredictions: StockPrediction[];
  deadInventory: DeadInventory[];
  fastMoving: FastMoving[];
}

export function useAiChat() {
  return useMutation({
    mutationFn: async ({ message, history }: { message: string; history: ChatMessage[] }) => {
      const { data } = await apiClient.post<ApiResponse<string>>('/ai/chat', { message, history });
      return data.data;
    },
  });
}

export function useAiForecasts() {
  return useQuery({
    queryKey: ['ai-forecasts'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<AiForecasts>>('/ai/forecasts');
      return data.data;
    },
  });
}
