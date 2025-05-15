import { API, MOCK_DATA } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Flag para habilitar dados mocados em vez de chamadas reais da API
// Em produção, isso deve ser false
const USE_MOCK_DATA = false;

// Configurações para timeout e retry
const API_CONFIG = {
  TIMEOUT_MS: 15000,       // 15 segundos (reduzido de 60 segundos)
  MAX_RETRIES: 2,          // Número máximo de tentativas
  RETRY_DELAY_MS: 1000,    // Delay inicial entre tentativas (1 segundo)
  USE_CACHE: true,         // Habilitar cache offline
  CACHE_EXPIRY_MS: 24 * 60 * 60 * 1000, // 24 horas
  ALTERNATE_SERVER_CHECK_INTERVAL_MS: 30 * 60 * 1000 // 30 minutos
};

// Estado da API para tracking do servidor ativo
let activeServerUrl = API.BASE_URL;
let lastServerCheckTime = 0;

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
 * Funções de cache para armazenamento local
 */
const CacheService = {
  async getCache<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await AsyncStorage.getItem(`cache_${key}`);
      if (!cachedData) return null;
      
      const { data, timestamp } = JSON.parse(cachedData);
      
      // Verificar se o cache expirou
      if (Date.now() - timestamp > API_CONFIG.CACHE_EXPIRY_MS) {
        // Cache expirado, limpar e retornar null
        await AsyncStorage.removeItem(`cache_${key}`);
        return null;
      }
      
      return data as T;
    } catch (e) {
      console.warn('Erro ao acessar cache:', e);
      return null;
    }
  },
  
  async setCache<T>(key: string, data: T): Promise<void> {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Erro ao salvar cache:', e);
    }
  }
};

/**
 * Verifica se há conexão com a internet
 */
async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true && state.isInternetReachable === true;
}

/**
 * Implementação de delay para retry
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Verifica e atualiza o servidor ativo (principal ou backup)
 */
async function checkAndUpdateActiveServer(): Promise<string> {
  // Verificar se é hora de testar os servidores novamente
  const now = Date.now();
  if (now - lastServerCheckTime < API_CONFIG.ALTERNATE_SERVER_CHECK_INTERVAL_MS) {
    return activeServerUrl;
  }
  
  lastServerCheckTime = now;
  
  // Tentar o servidor principal primeiro
  if (await API.isServerAvailable(API.BASE_URL)) {
    activeServerUrl = API.BASE_URL;
    return activeServerUrl;
  }
  
  // Se o servidor principal falhar, tentar o backup
  if (await API.isServerAvailable(API.BACKUP_URL)) {
    activeServerUrl = API.BACKUP_URL;
    return activeServerUrl;
  }
  
  // Se ambos falharem, manter o atual (pode ainda estar funcionando para endpoints específicos)
  return activeServerUrl;
}

/**
 * Função de fetch com timeout e retry
 */
async function fetchWithRetry<T>(
  url: string, 
  options: RequestInit, 
  retries: number = API_CONFIG.MAX_RETRIES,
  retryDelay: number = API_CONFIG.RETRY_DELAY_MS
): Promise<Response> {
  try {
    const controller = new AbortController();
    const { signal } = controller;
    
    // Timeout para a requisição
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, API_CONFIG.TIMEOUT_MS);
    
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    
    return response;
  } catch (err: any) {
    if (retries <= 0) throw err;
    
    if (err.name === 'AbortError') {
      console.log(`Requisição para ${url} excedeu o tempo limite. Tentativas restantes: ${retries}`);
    } else {
      console.log(`Erro ao acessar ${url}. Tentativas restantes: ${retries}`, err);
    }
    
    // Esperar antes de tentar novamente, com backoff exponencial
    await delay(retryDelay);
    
    // Retry com backoff exponencial
    return fetchWithRetry(url, options, retries - 1, retryDelay * 2);
  }
}

/**
 * Função genérica de fetch com tratamento de erros, cache e retry
 */
async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  // Criar uma chave de cache baseada no endpoint
  const cacheKey = endpoint.replace(/[^a-zA-Z0-9]/g, '_');
  
  // Verificar se estamos usando dados mocados
  if (USE_MOCK_DATA) {
    // Simular delay de rede
    await delay(500);
    
    // Retornar dados mocados baseados no endpoint
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
  
  // Verificar conexão com a internet
  const online = await isOnline();
  
  // Se não estiver online e o cache estiver habilitado, tentar buscar do cache
  if (!online && API_CONFIG.USE_CACHE) {
    const cachedData = await CacheService.getCache<T>(cacheKey);
    if (cachedData) {
      console.log(`Usando dados em cache para ${endpoint} (modo offline)`);
      return cachedData;
    }
    
    // Se não houver dados em cache, notificar o usuário
    throw new ApiError('Sem conexão com a internet. Verifique sua conexão e tente novamente.', 503);
  }
  
  try {
    // Verificar qual servidor está ativo
    const serverUrl = await checkAndUpdateActiveServer();
    console.log(`Fazendo requisição real para: ${serverUrl}${endpoint}`);
    
    // Usar nossa função de fetch com retry e timeout
    const response = await fetchWithRetry(
      `${serverUrl}${endpoint}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      
      // Se for erro 5xx, talvez o servidor principal tenha caído
      // Tentar alternar para o servidor de backup se for um erro do servidor
      if (response.status >= 500 && serverUrl === API.BASE_URL) {
        if (await API.isServerAvailable(API.BACKUP_URL)) {
          console.log('Alternando para servidor de backup após erro 5xx');
          activeServerUrl = API.BACKUP_URL;
          
          // Tentar novamente com o servidor de backup
          return fetchFromAPI<T>(endpoint);
        }
      }
      
      throw new ApiError(`Erro na API: ${response.status}`, response.status);
    }
    
    const data = await response.json();
    console.log(`Resposta da API para ${endpoint} recebida com sucesso`);
    
    // Verificar se a resposta tem o formato esperado
    if (data && typeof data === 'object' && 'success' in data && !data.success) {
      throw new ApiError('Resposta indica falha na API', 500);
    }
    
    // Armazenar em cache se o cache estiver habilitado
    if (API_CONFIG.USE_CACHE) {
      await CacheService.setCache(cacheKey, data);
    }
    
    return data as T;
  } catch (error: any) {
    console.error('API request failed:', error);
    
    // Se for um ApiError, apenas propagar
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Tratar diferentes tipos de erros
    if (error.name === 'AbortError') {
      // Se o servidor atual falhou por timeout, tentar o servidor alternativo
      if (activeServerUrl === API.BASE_URL) {
        console.log('Timeout no servidor principal, tentando servidor de backup');
        activeServerUrl = API.BACKUP_URL;
        try {
          return await fetchFromAPI<T>(endpoint);
        } catch (backupError) {
          // Se o backup também falhar, voltar para o servidor principal
          activeServerUrl = API.BASE_URL;
        }
      }
      
      throw new ApiError('Tempo de conexão esgotado. Verifique sua internet ou tente novamente.', 408);
    }
    
    if (error.message && error.message.includes('Network request failed')) {
      // Tentar buscar do cache em caso de falha de rede
      if (API_CONFIG.USE_CACHE) {
        const cachedData = await CacheService.getCache<T>(cacheKey);
        if (cachedData) {
          console.log(`Fallback para cache após falha de rede: ${endpoint}`);
          return cachedData;
        }
      }
      
      throw new ApiError('Erro de conexão. Verifique sua internet ou o endereço do servidor.', 503);
    }
    
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