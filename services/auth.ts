import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiService, ApiError } from './api';

// Chave para armazenamento da matrícula no AsyncStorage
const AUTH_MATRICULA_KEY = '@AquaLink:matricula';
const AUTH_USER_DATA_KEY = '@AquaLink:userData';
const AUTH_LAST_LOGIN_KEY = '@AquaLink:lastLogin';

/**
 * Serviço de autenticação que gerencia credenciais de usuário
 */
export const AuthService = {
  /**
   * Tenta fazer login usando matrícula
   * @param matricula Número da matrícula do cliente
   * @returns Informações do cliente se autenticado com sucesso
   */
  login: async (matricula: string) => {
    try {
      console.log(`Tentando login com matrícula: ${matricula}`);
      
      if (!matricula || matricula.trim() === '') {
        throw new Error('Matrícula não pode ser vazia');
      }
      
      // Normaliza a matrícula (remove espaços e caracteres especiais)
      const normalizedMatricula = matricula.trim().replace(/[^0-9]/g, '');
      
      // Valida a matrícula consultando dados do cliente
      const response = await ApiService.getClientData(normalizedMatricula);
      
      if (response && typeof response === 'object' && 'cliente' in response && response.cliente) {
        console.log('Login bem-sucedido:', response.cliente.nome);
        
        // Armazena a matrícula e dados do usuário
        const userData = response.cliente;
        await AsyncStorage.setItem(AUTH_MATRICULA_KEY, normalizedMatricula);
        await AsyncStorage.setItem(AUTH_USER_DATA_KEY, JSON.stringify(userData));
        await AsyncStorage.setItem(AUTH_LAST_LOGIN_KEY, new Date().toISOString());
        
        return userData;
      } else {
        console.error('Resposta não contém dados do cliente:', response);
        throw new Error('Dados do cliente não encontrados');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      
      if (error instanceof ApiError) {
        // Erros específicos da API
        if (error.status === 404) {
          throw new Error('Matrícula não encontrada');
        } else if (error.status === 401 || error.status === 403) {
          throw new Error('Acesso não autorizado');
        } else if (error.status >= 500) {
          throw new Error('Erro no servidor. Tente novamente mais tarde.');
        }
      }
      
      // Erro genérico
      throw new Error('Matrícula inválida ou erro na autenticação');
    }
  },
  
  /**
   * Verifica se o usuário está logado
   * @returns A matrícula do usuário se estiver autenticado, ou null caso contrário
   */
  isAuthenticated: async (): Promise<string | null> => {
    try {
      const matricula = await AsyncStorage.getItem(AUTH_MATRICULA_KEY);
      const lastLogin = await AsyncStorage.getItem(AUTH_LAST_LOGIN_KEY);
      
      if (matricula && lastLogin) {
        // Verificar se o login expirou (opcional)
        const loginDate = new Date(lastLogin);
        const now = new Date();
        const daysSinceLogin = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24);
        
        // Se o login foi há mais de 30 dias, considere expirado
        if (daysSinceLogin > 30) {
          console.log('Login expirado, fazendo logout automático');
          await AuthService.logout();
          return null;
        }
        
        return matricula;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return null;
    }
  },
  
  /**
   * Obtém a matrícula armazenada do usuário autenticado
   * @returns A matrícula do usuário ou null se não estiver autenticado
   */
  getMatricula: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(AUTH_MATRICULA_KEY);
  },
  
  /**
   * Obtém os dados do usuário armazenados localmente
   * @returns Dados do usuário ou null se não estiver autenticado
   */
  getUserData: async () => {
    try {
      const userData = await AsyncStorage.getItem(AUTH_USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  },
  
  /**
   * Efetua logout do usuário
   */
  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AUTH_MATRICULA_KEY);
      await AsyncStorage.removeItem(AUTH_USER_DATA_KEY);
      await AsyncStorage.removeItem(AUTH_LAST_LOGIN_KEY);
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
}; 