import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Staff hooks
export function useStaff() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data } = await apiClient.get('/payroll/staff');
      return data.data;
    },
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (staffData: any) => {
      const { data } = await apiClient.post('/payroll/staff', staffData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

export function useUpdateStaffStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await apiClient.patch(`/payroll/staff/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

// Leave hooks
export function useLeaveRequests() {
  return useQuery({
    queryKey: ['leaves'],
    queryFn: async () => {
      const { data } = await apiClient.get('/payroll/leaves');
      return data.data;
    },
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ staffId, leaveData }: { staffId: string; leaveData: any }) => {
      const { data } = await apiClient.post(`/payroll/staff/${staffId}/leaves`, leaveData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
}

export function useUpdateLeaveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await apiClient.patch(`/payroll/leaves/${id}`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
}

// Payslips hooks
export function usePayslips() {
  return useQuery({
    queryKey: ['payslips'],
    queryFn: async () => {
      const { data } = await apiClient.get('/payroll/payslips');
      return data.data;
    },
  });
}

export function useCreatePayslip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ staffId, payslipData }: { staffId: string; payslipData: any }) => {
      const { data } = await apiClient.post(`/payroll/staff/${staffId}/payslips`, payslipData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] });
    },
  });
}

export function useUpdatePayslipStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await apiClient.patch(`/payroll/payslips/${id}`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] });
    },
  });
}
