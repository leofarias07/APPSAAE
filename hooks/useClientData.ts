import { useQuery } from '@tanstack/react-query';
import { ApiService, ClientDataResponse } from '@/services/api';
import { getMatricula } from './useMatricula';

export function useClientData() {
  // Query para buscar os dados do cliente
  return useQuery({
    queryKey: ['clientData'],
    queryFn: async () => {
      const matricula = await getMatricula();
      return ApiService.getClientData(matricula);
    },
    // Usar as configurações globais definidas no QueryProvider
  });
} 