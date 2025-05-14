export const API = {
  BASE_URL: 'http://45.162.56.223:3000',
  
  // Endpoints
  CLIENT_DATA: (matricula: string) => 
    `/api/mobile/clientes/${matricula}/dados-basicos`,
  
  BILLS: (matricula: string, limit?: number, status?: string) => {
    let url = `/api/mobile/clientes/${matricula}/faturas`;
    const params = new URLSearchParams();
    
    if (limit) params.append('limit', limit.toString());
    if (status) params.append('status', status);
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  },
  
  BILL_DETAILS: (matricula: string, codigoFatura: string, numeroParcela: string) => 
    `/api/mobile/clientes/${matricula}/faturas/${codigoFatura}/${numeroParcela}`,
  
  CONSUMPTION: (matricula: string, limite?: number) => {
    let url = `/api/mobile/clientes/${matricula}/consumo`;
    if (limite) url += `?limite=${limite}`;
    return url;
  }
};

// Mock data for development
export const MOCK_DATA = {
  MATRICULA: '000018763',
  
  // Client data mock
  CLIENT_DATA: {
    success: true,
    cliente: {
      matricula: '000012345',
      nome: 'João da Silva',
      endereco: 'Rua das Flores, 123. Centro, São Paulo-SP. CEP: 01234-567',
      documento: '123******89'
    }
  },
  
  // Bills mock
  BILLS: {
    success: true,
    count: 5,
    total: 10,
    faturas: [
      {
        id: '12345',
        parcela: 1,
        matricula: '000012345',
        valor: 75.50,
        dataVencimento: '15/06/2023',
        dataEmissao: '01/06/2023',
        status: 'aberto',
        referencia: '06/2023'
      },
      {
        id: '12346',
        parcela: 1,
        matricula: '000012345',
        valor: 72.30,
        dataVencimento: '15/05/2023',
        dataEmissao: '01/05/2023',
        status: 'pago',
        referencia: '05/2023'
      },
      {
        id: '12347',
        parcela: 1,
        matricula: '000012345',
        valor: 78.10,
        dataVencimento: '15/04/2023',
        dataEmissao: '01/04/2023',
        status: 'pago',
        referencia: '04/2023'
      },
      {
        id: '12348',
        parcela: 1,
        matricula: '000012345',
        valor: 70.90,
        dataVencimento: '15/03/2023',
        dataEmissao: '01/03/2023',
        status: 'pago',
        referencia: '03/2023'
      },
      {
        id: '12349',
        parcela: 1,
        matricula: '000012345',
        valor: 68.20,
        dataVencimento: '15/02/2023',
        dataEmissao: '01/02/2023',
        status: 'pago',
        referencia: '02/2023'
      }
    ]
  },
  
  // Bill details mock
  BILL_DETAILS: {
    success: true,
    fatura: {
      id: '12345',
      parcela: 1,
      matricula: '000012345',
      valor: 75.50,
      dataVencimento: '15/06/2023',
      dataEmissao: '01/06/2023',
      status: 'aberto',
      referencia: '06/2023',
      descricao: 'Fatura de Água e Esgoto',
      consumo: {
        metros: 15.5,
        leituraAnterior: 1250.5,
        leituraAtual: 1266.0,
        dataLeitura: '25/05/2023'
      },
      detalhamento: {
        valorAgua: 45.50,
        valorEsgoto: 25.00,
        valorServicos: 5.00
      },
      pix: {
        qrCode: '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000...',
        chaveCopiaCola: '00020126580014br.gov.bcb.pix0136123e4567...',
        disponivel: true
      }
    }
  },
  
  // Consumption mock
  CONSUMPTION: {
    success: true,
    consumo: [
      {
        mes: '05',
        ano: '2023',
        referencia: '05/2023',
        consumo: 15.5
      },
      {
        mes: '04',
        ano: '2023',
        referencia: '04/2023',
        consumo: 16.2
      },
      {
        mes: '03',
        ano: '2023',
        referencia: '03/2023',
        consumo: 14.8
      },
      {
        mes: '02',
        ano: '2023',
        referencia: '02/2023',
        consumo: 13.7
      },
      {
        mes: '01',
        ano: '2023',
        referencia: '01/2023',
        consumo: 14.1
      },
      {
        mes: '12',
        ano: '2022',
        referencia: '12/2022',
        consumo: 15.9
      }
    ],
    estatisticas: {
      medio: 14.8,
      atual: 15.5
    },
    ultimaLeitura: {
      valor: 15.5,
      data: '25/05/2023',
      leituraAnterior: 1250.5,
      leituraAtual: 1266.0
    }
  }
};