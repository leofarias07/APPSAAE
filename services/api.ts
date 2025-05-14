import { API, MOCK_DATA } from '@/constants/api';

// Flag to enable mock data instead of actual API calls
const USE_MOCK_DATA = false;

/**
 * Interface para respostas padrão da API
 */
export interface ApiResponse {
  success: boolean;
  [key: string]: any;
}

/**
 * Erro personalizado para falhas na API
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Generic fetch function with error handling
 */
async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data based on endpoint
    if (endpoint.includes('dados-basicos')) {
      return MOCK_DATA.CLIENT_DATA as unknown as T;
    } else if (endpoint.includes('faturas') && endpoint.split('/').length > 5) {
      return MOCK_DATA.BILL_DETAILS as unknown as T;
    } else if (endpoint.includes('faturas')) {
      return MOCK_DATA.BILLS as unknown as T;
    } else if (endpoint.includes('consumo')) {
      return MOCK_DATA.CONSUMPTION as unknown as T;
    }
    
    throw new Error('No mock data available for this endpoint');
  }
  
  try {
    console.log(`Fazendo requisição real para: ${API.BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API.BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new ApiError(`Erro na API: ${response.status}`, response.status);
    }
    
    const data = await response.json();
    console.log(`Resposta da API para ${endpoint}:`, data);
    
    // Verificar se a resposta tem o formato esperado
    if (!data.success) {
      throw new ApiError('Resposta inválida da API', 500);
    }
    
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('API request failed:', error);
    throw new ApiError('Falha na comunicação com o servidor', 500);
  }
}

/**
 * API Functions
 */
export const ApiService = {
  // Fetch client data
  getClientData: (matricula: string) => {
    return fetchFromAPI<ClientDataResponse>(API.CLIENT_DATA(matricula));
  },
  
  // Fetch client bills
  getBills: (
    matricula: string, 
    limit?: number, 
    status?: string
  ) => {
    return fetchFromAPI<BillsResponse>(API.BILLS(matricula, limit, status as any));
  },
  
  // Fetch single bill details
  getBillDetails: (
    matricula: string, 
    codigoFatura: string, 
    numeroParcela: string
  ) => {
    return fetchFromAPI<BillDetailsResponse>(API.BILL_DETAILS(matricula, codigoFatura, numeroParcela));
  },
  
  // Fetch consumption history
  getConsumption: (matricula: string, limite?: number) => {
    return fetchFromAPI<ConsumptionResponse>(API.CONSUMPTION(matricula, limite));
  }
};

// Definição de tipos baseada nas respostas esperadas da API
export interface ClientDataResponse {
  success: boolean;
  cliente: {
    matricula: string;
    nome: string;
    endereco: string;
    documento: string;
  };
}

export interface BillsResponse {
  success: boolean;
  count: number;
  total: number;
  faturas: Array<{
    id: string;
    parcela: number;
    matricula: string;
    valor: number;
    dataVencimento: string;
    dataEmissao: string;
    status: 'aberto' | 'pago';
    referencia: string;
  }>;
}

export interface BillDetailsResponse {
  success: boolean;
  fatura: {
    id: string;
    parcela: number;
    matricula: string;
    valor: number;
    dataVencimento: string;
    dataEmissao: string;
    status: 'aberto' | 'pago';
    referencia: string;
    descricao: string;
    consumo: {
      metros: number;
      leituraAnterior: number;
      leituraAtual: number;
      dataLeitura: string;
    };
    detalhamento: {
      valorAgua: number;
      valorEsgoto: number;
      valorServicos: number;
    };
    pix?: {
      qrCode: string;
      chaveCopiaCola: string;
      disponivel: boolean;
    };
  };
}

export interface ConsumptionResponse {
  success: boolean;
  consumo: Array<{
    mes: string;
    ano: string;
    referencia: string;
    consumo: number;
  }>;
  estatisticas?: {
    medio: number;
    atual: number;
  };
  ultimaLeitura?: {
    valor: number;
    data: string;
    leituraAnterior: number;
    leituraAtual: number;
  };
  message?: string;
}