# AquaLink

Aplicativo de gestão de água e faturas usando React Native e Expo.

## Recursos Implementados

- Visualização de faturas e histórico de pagamentos
- Monitoramento de consumo de água
- Dashboard personalizado
- Pagamento via PIX

## Integrações com APIs

O AquaLink utiliza as seguintes APIs:

| Endpoint | Status | Implementação |
|----------|--------|---------------|
| `/api/mobile/clientes/[matricula]/dados-basicos` | ✅ Implementado | `useClientData()` hook |
| `/api/mobile/clientes/[matricula]/faturas` | ✅ Implementado | `useBills()` hook |
| `/api/mobile/clientes/[matricula]/faturas/[codigoFatura]/[numeroParcela]` | ✅ Implementado | `useBillDetails()` hook |
| `/api/mobile/clientes/[matricula]/consumo` | ✅ Implementado | `useConsumption()` hook |

## Gerenciamento de Dados

O aplicativo utiliza React Query para otimizar o gerenciamento de estados e cache:

- **Retry automático**: Tentativas automáticas em caso de falha na conexão
- **Cache inteligente**: Dados em cache são mostrados enquanto novas consultas são feitas em segundo plano
- **Atualização otimizada**: Revalidação configurável por endpoint
- **Gestão de estados**: Simplificação do código eliminando estados manuais

### Hooks Disponíveis

```typescript
// Dados do cliente
const { data, isLoading, error } = useClientData();

// Faturas
const { data, isLoading, error } = useBills({ 
  limit: 10,
  status: 'aberto' // 'aberto', 'pago' ou 'todos'
});

// Detalhes de fatura
const { data, isLoading, error } = useBillDetails({
  codigoFatura: '12345',
  numeroParcela: '1'
});

// Histórico de consumo
const { data, isLoading, error } = useConsumption({
  limite: 12 // Quantidade de meses
});
```

## Requisitos

- Node.js 14+
- Expo CLI
- Android Studio/XCode para emulação

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm start
```

## Build APK

```bash
# Gerar APK
npx eas build -p android --profile apk
``` 