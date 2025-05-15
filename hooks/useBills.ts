import { useQuery } from '@tanstack/react-query';
import { ApiService, BillsResponse } from '@/services/api';
import { getMatricula } from './useMatricula';

interface UseBillsOptions {
  limit?: number;
  status?: 'aberto' | 'pago' | 'todos';
}

export function useBills(options: UseBillsOptions = {}) {
  const { limit, status } = options;

  // Query para buscar as faturas
  return useQuery({
    queryKey: ['bills', { limit, status }],
    queryFn: async () => {
      const matricula = await getMatricula();
      return ApiService.getBills(matricula, limit, status);
    },
    // Usar as configurações globais definidas no QueryProvider
  });
} 