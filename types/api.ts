// Tipos centralizados para consumo das APIs mobile

export interface ClienteBasico {
  matricula: string;
  nome: string;
  endereco: string;
  documento: string;
}

export interface Fatura {
  id: string;
  parcela: number;
  matricula: string;
  valor: number;
  dataVencimento: string;
  dataEmissao: string;
  status: 'aberto' | 'pago';
  referencia: string;
}

export interface DetalheFatura extends Fatura {
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
}

export interface DadosConsumo {
  mes: string;
  ano: string;
  referencia: string;
  consumo: number;
}

export interface EstatisticasConsumo {
  medio: number;
  atual: number;
}

export interface UltimaLeitura {
  valor: number;
  data: string;
  leituraAnterior: number;
  leituraAtual: number;
} 