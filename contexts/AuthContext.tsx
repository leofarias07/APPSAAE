import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthService } from '@/services/auth';

type Cliente = {
  matricula: string;
  nome: string;
  endereco: string;
  documento: string;
};

interface AuthContextData {
  isAuthenticated: boolean;
  cliente: Cliente | null;
  matricula: string | null;
  login: (matricula: string) => Promise<Cliente | null>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [matricula, setMatricula] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação quando o contexto é montado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedMatricula = await AuthService.getMatricula();
        
        if (storedMatricula) {
          try {
            // Tenta obter dados do cliente para validar a matrícula
            const response = await AuthService.login(storedMatricula);
            if (response && typeof response === 'object' && 'matricula' in response) {
              setCliente(response as Cliente);
              setMatricula(storedMatricula);
              setIsAuthenticated(true);
            } else {
              await AuthService.logout();
              setIsAuthenticated(false);
            }
          } catch (error) {
            // Se falhar, faz logout
            await AuthService.logout();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (matriculaInput: string): Promise<Cliente | null> => {
    try {
      setIsLoading(true);
      const clienteData = await AuthService.login(matriculaInput);
      
      if (clienteData && typeof clienteData === 'object' && 'matricula' in clienteData) {
        const clienteTyped = clienteData as Cliente;
        setCliente(clienteTyped);
        setMatricula(matriculaInput);
        setIsAuthenticated(true);
        return clienteTyped;
      }
      
      return null;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setCliente(null);
      setMatricula(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        cliente,
        matricula,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
} 