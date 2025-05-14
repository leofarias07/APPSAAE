# API Mobile - Documentação
desenvolva em Expo, React Native
## Visão Geral

Esta documentação apresenta as APIs específicas para aplicativos móveis que foram criadas para consumo eficiente e otimizado de dados diretamente nos apps.

As APIs Mobile foram desenhadas considerando:
- Tráfego de dados reduzido
- Campos simplificados e essenciais
- Formatos padronizados para uso direto na interface
- Resposta mais leve e com melhor desempenho
- Respeito às regras de negócio (como a desativação de multas e juros)

## Status de Implementação

O aplicativo AquaLink foi atualizado para consumir dados reais da API. As seguintes integrações foram concluídas:

| Endpoint | Status | Implementação |
|----------|--------|---------------|
| `/api/mobile/clientes/[matricula]/dados-basicos` | ✅ Implementado | `ApiService.getClientData()` |
| `/api/mobile/clientes/[matricula]/faturas` | ✅ Implementado | `ApiService.getBills()` |
| `/api/mobile/clientes/[matricula]/faturas/[codigoFatura]/[numeroParcela]` | ✅ Implementado | `ApiService.getBillDetails()` |
| `/api/mobile/clientes/[matricula]/consumo` | ✅ Implementado | `ApiService.getConsumption()` |

### Próximos Passos

- Implementação de hooks personalizados para facilitar o acesso aos dados da API
- Integração com React Query para gerenciamento de cache e revalidação
- Melhorias na autenticação com tokens JWT
- Implementação de testes unitários para garantir a robustez da integração

## Estrutura de URLs

Todas as APIs Mobile estão agrupadas sob o caminho base:
```
URLBASE: http://45.162.56.223:3000/
/api/mobile/
```

### Endpoints Disponíveis

| Endpoint | Descrição |
|----------|-----------|
| `/api/mobile/clientes/[matricula]/dados-basicos` | Dados cadastrais do cliente |
| `/api/mobile/clientes/[matricula]/faturas` | Lista faturas e débitos de um cliente |
| `/api/mobile/clientes/[matricula]/faturas/[codigoFatura]/[numeroParcela]` | Detalhes de uma fatura específica com dados PIX |
| `/api/mobile/clientes/[matricula]/consumo` | Retorna histórico de consumo de água |

## 1. API de Dados Básicos (`/api/mobile/clientes/[matricula]/dados-basicos`)

Endpoint para obter informações básicas do cliente para exibição em perfil, cabeçalhos e dashboards.

### Parâmetros de Consulta
Nenhum parâmetro adicional é necessário.

### Resposta
```json
{
  "success": true,
  "cliente": {
    "matricula": "000012345",
    "nome": "João da Silva",
    "endereco": "Rua das Flores, 123. Centro, São Paulo-SP. CEP: 01234-567",
    "documento": "123******89"
  }
}
```

### Observações
- O documento é parcialmente mascarado por questões de segurança
- O endereço é formatado em uma única string para facilitar a exibição

## 2. API de Faturas (`/api/mobile/clientes/[matricula]/faturas`)

Endpoint para listar faturas/parcelas de um cliente em formato otimizado para aplicações móveis.

### Parâmetros de Consulta
- `limit` (opcional): Número máximo de faturas a retornar (padrão: 20)
- `status` (opcional): Filtrar por situação. Valores: `todos`, `aberto`, `pago` (padrão: `todos`)

### Resposta
```json
{
  "success": true,
  "count": 5,
  "total": 10,
  "faturas": [
    {
      "id": "12345",
      "parcela": 1,
      "matricula": "000012345",
      "valor": 75.50,
      "dataVencimento": "15/06/2023",
      "dataEmissao": "01/06/2023",
      "status": "aberto",
      "referencia": "06/2023"
    },
    // outras faturas...
  ]
}
```

### Observações
- O valor retornado já considera a regra de negócio sem multas e juros
- O status é simplificado para apenas `aberto` ou `pago`, não existe mais o conceito de `vencido`
- Datas são fornecidas no formato brasileiro (dd/mm/aaaa)

## 3. API de Detalhes de Fatura (`/api/mobile/clientes/[matricula]/faturas/[codigoFatura]/[numeroParcela]`)

Endpoint para obter informações detalhadas de uma fatura específica, incluindo dados de pagamento PIX.

### Parâmetros de URL
- `matricula`: Matrícula do cliente
- `codigoFatura`: Código da fatura ou débito
- `numeroParcela`: Número da parcela

### Resposta
```json
{
  "success": true,
  "fatura": {
    "id": "12345",
    "parcela": 1,
    "matricula": "000012345",
    "valor": 75.50,
    "dataVencimento": "15/06/2023",
    "dataEmissao": "01/06/2023",
    "status": "aberto",
    "referencia": "06/2023",
    "descricao": "Fatura de Água e Esgoto",
    "consumo": {
      "metros": 15.5,
      "leituraAnterior": 1250.5,
      "leituraAtual": 1266.0,
      "dataLeitura": "25/05/2023"
    },
    "detalhamento": {
      "valorAgua": 45.50,
      "valorEsgoto": 25.00,
      "valorServicos": 5.00
    },
    "pix": {
      "qrCode": "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000...",
      "chaveCopiaCola": "00020126580014br.gov.bcb.pix0136123e4567...",
      "disponivel": true
    }
  }
}
```

### Observações
- Dados de pagamento PIX só estão disponíveis para faturas com status `aberto`
- Os valores de consumo são fornecidos para permitir visualizações detalhadas no app
- A propriedade `pix.disponivel` indica se é possível pagar via PIX
- O valor retornado já considera a regra de negócio sem multas e juros

## 4. API de Consumo (`/api/mobile/clientes/[matricula]/consumo`)

Endpoint para obter histórico de consumo de água de um cliente.

### Parâmetros de Consulta
- `limite` (opcional): Número de meses no histórico (padrão: 12)

### Resposta
```json
{
  "success": true,
  "consumo": [
    {
      "mes": "05",
      "ano": "2023",
      "referencia": "05/2023",
      "consumo": 15.5
    },
    // outros meses...
  ],
  "estatisticas": {
    "medio": 14.8,
    "atual": 15.5
  },
  "ultimaLeitura": {
    "valor": 15.5,
    "data": "25/05/2023",
    "leituraAnterior": 1250.5,
    "leituraAtual": 1266.0
  }
}
```

### Observações
- O consumo é fornecido em metros cúbicos (m³)
- Os dados são ordenados do mais recente para o mais antigo
- A estrutura é otimizada para uso em gráficos de barras/linhas em apps

## Autenticação

Atualmente as APIs não requerem autenticação, mas recomenda-se implementar:
- Token JWT para autenticação
- Rate limiting para evitar abusos

## Versionamento e Evolução

Esta é a primeira versão das APIs Mobile. Futuras versões podem incluir:
- Melhorias de desempenho
- Novos campos e endpoints
- Autenticação e autorização
- Integração com notificações push

## Contato

Para mais informações sobre a API Mobile, entre em contato com o time de desenvolvimento. 