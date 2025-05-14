/**
 * Format a number as Brazilian currency (R$)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Format a date string (dd/mm/yyyy) to a more readable format
 */
export function formatDate(dateString: string): string {
  const [day, month, year] = dateString.split('/');
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return `${day} de ${months[parseInt(month) - 1]} de ${year}`;
}

/**
 * Mask a document number (CPF/CNPJ)
 */
export function maskDocument(document: string): string {
  // If it's a CPF (11 digits)
  if (document.length === 11) {
    return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.$3-**');
  }
  
  // If it's a CNPJ (14 digits)
  if (document.length === 14) {
    return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.***.***/****-**');
  }
  
  // If it's already masked or has another format
  return document;
}