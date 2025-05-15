import { useQuery } from '@tanstack/react-query';
import { ApiService, ConsumptionResponse } from '@/services/api';
import { getMatricula } from './useMatricula';

interface UseConsumptionOptions {
  limite?: number;
  enabled?: boolean;
}

export function useConsumption({ limite, enabled = true }: UseConsumptionOptions = {}) {
  // Query para buscar o histórico de consumo
  return useQuery({
    queryKey: ['consumption', { limite }],
    queryFn: async () => {
      const matricula = await getMatricula();
      return ApiService.getConsumption(matricula, limite);
    },
    enabled,
    // Usar as configurações globais definidas no QueryProvider
  });
} 