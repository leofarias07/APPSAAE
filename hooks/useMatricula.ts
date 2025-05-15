import { AuthService } from '@/services/auth';

/**
 * Função utilitária para obter a matrícula do cliente autenticado
 * @returns Matrícula do cliente
 * @throws Erro se não estiver autenticado
 */
export async function getMatricula(): Promise<string> {
  const matricula = await AuthService.getMatricula();
  if (!matricula) {
    throw new Error('Usuário não autenticado');
  }
  return matricula;
} 