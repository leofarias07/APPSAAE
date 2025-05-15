import { useQuery } from '@tanstack/react-query';
import { ApiService, BillDetailsResponse } from '@/services/api';
import { getMatricula } from './useMatricula';

interface UseBillDetailsOptions {
  codigoFatura: string;
  numeroParcela: string;
  enabled?: boolean;
}

export function useBillDetails({ codigoFatura, numeroParcela, enabled = true }: UseBillDetailsOptions) {
  // Query para buscar os detalhes da fatura
  return useQuery({
    queryKey: ['billDetails', codigoFatura, numeroParcela],
    queryFn: async () => {
      const matricula = await getMatricula();
      return ApiService.getBillDetails(matricula, codigoFatura, numeroParcela);
    },
    enabled, // Permite desabilitar a query até que os parâmetros estejam disponíveis
    // Usar as configurações globais definidas no QueryProvider
  });
} 