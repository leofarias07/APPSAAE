import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ApiService } from '@/services/api';
import { ClienteBasico, Fatura, DetalheFatura, DadosConsumo, EstatisticasConsumo, UltimaLeitura } from '@/types/api';

interface ClientContextData {
  cliente: ClienteBasico | null;
  faturas: Fatura[];
  detalheFatura: DetalheFatura | null;
  consumo: DadosConsumo[];
  estatisticas: EstatisticasConsumo | null;
  ultimaLeitura: UltimaLeitura | null;
  loading: boolean;
  error: string | null;
  fetchCliente: (matricula: string) => Promise<void>;
  fetchFaturas: (matricula: string, limit?: number, status?: string) => Promise<void>;
  fetchDetalheFatura: (matricula: string, codigoFatura: string, numeroParcela: string) => Promise<void>;
  fetchConsumo: (matricula: string, limite?: number) => Promise<void>;
}

const ClientContext = createContext<ClientContextData>({} as ClientContextData);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [cliente, setCliente] = useState<ClienteBasico | null>(null);
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [detalheFatura, setDetalheFatura] = useState<DetalheFatura | null>(null);
  const [consumo, setConsumo] = useState<DadosConsumo[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasConsumo | null>(null);
  const [ultimaLeitura, setUltimaLeitura] = useState<UltimaLeitura | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCliente = useCallback(async (matricula: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getClientData(matricula);
      setCliente(response.cliente);
    } catch (err: any) {
      setError('Erro ao carregar dados do cliente');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFaturas = useCallback(async (matricula: string, limit?: number, status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getBills(matricula, limit, status);
      setFaturas(response.faturas);
    } catch (err: any) {
      setError('Erro ao carregar faturas');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetalheFatura = useCallback(async (matricula: string, codigoFatura: string, numeroParcela: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getBillDetails(matricula, codigoFatura, numeroParcela);
      setDetalheFatura(response.fatura);
    } catch (err: any) {
      setError('Erro ao carregar detalhes da fatura');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConsumo = useCallback(async (matricula: string, limite?: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getConsumption(matricula, limite);
      setConsumo(response.consumo);
      setEstatisticas(response.estatisticas ?? null);
      setUltimaLeitura(response.ultimaLeitura ?? null);
    } catch (err: any) {
      setError('Erro ao carregar histórico de consumo');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ClientContext.Provider
      value={{
        cliente,
        faturas,
        detalheFatura,
        consumo,
        estatisticas,
        ultimaLeitura,
        loading,
        error,
        fetchCliente,
        fetchFaturas,
        fetchDetalheFatura,
        fetchConsumo,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export function useClient() {
  return useContext(ClientContext);
} 