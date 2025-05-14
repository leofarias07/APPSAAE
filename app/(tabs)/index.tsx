import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  useColorScheme,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { 
  ApiService, 
  ClientDataResponse, 
  BillsResponse, 
  ConsumptionResponse 
} from '@/services/api';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { EmptyState } from '@/components/EmptyState';
import { checkReactNativeImports } from '@/utils/diagnostic';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react-native';

// Componentes refatorados
import { HomeHeader } from '@/components/home/HomeHeader';
import { BillSummary } from '@/components/home/BillSummary';
import { ConsumptionSummary } from '@/components/home/ConsumptionSummary';

// Define o tipo para o filtro de status
type FilterStatus = 'todos' | 'aberto' | 'pago';

// Definir constantes para os status
const STATUS = {
  ABERTO: 'aberto' as FilterStatus,
  PAGO: 'pago' as FilterStatus,
  TODOS: 'todos' as FilterStatus
};

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { matricula, isAuthenticated, cliente } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [clientData, setClientData] = useState<ClientDataResponse['cliente'] | null>(cliente);
  const [bills, setBills] = useState<BillsResponse['faturas']>([]);
  const [latestBill, setLatestBill] = useState<BillsResponse['faturas'][0] | null>(null);
  const [consumptionData, setConsumptionData] = useState<ConsumptionResponse | null>(null);
  
  const loadData = async () => {
    try {
      setError(null);
      
      // Verificar se há matrícula disponível
      if (!matricula) {
        setError('Não foi possível identificar sua matrícula. Por favor, faça login novamente.');
        setLoading(false);
        return;
      }

      // Carregar dados do cliente (se ainda não estiverem disponíveis no contexto)
      if (!clientData) {
        const clientResponse = await ApiService.getClientData(matricula);
        console.log('Resposta da API cliente:', JSON.stringify(clientResponse));
        
        if (clientResponse && typeof clientResponse === 'object') {
          if ('cliente' in clientResponse && clientResponse.cliente) {
            setClientData(clientResponse.cliente as ClientDataResponse['cliente']);
          } else if ('success' in clientResponse && clientResponse.success === true) {
            // Tenta encontrar dados do cliente em outra parte da resposta
            const possibleClientData = Object.values(clientResponse).find(
              value => value && typeof value === 'object' && 'nome' in value
            );
            
            if (possibleClientData) {
              setClientData(possibleClientData as ClientDataResponse['cliente']);
            }
          }
        }
      }
      
      // Carregar faturas em aberto
      const billsResponse = await ApiService.getBills(matricula, 5, 'aberto');
      console.log('Resposta da API bills (home):', JSON.stringify(billsResponse));
      
      if (billsResponse) {
        let faturasArray: BillsResponse['faturas'] = [];
        
        if (typeof billsResponse === 'object') {
          // Formato padrão: { faturas: [...] }
          if ('faturas' in billsResponse && Array.isArray(billsResponse.faturas)) {
            faturasArray = billsResponse.faturas;
          } 
          // Formato alternativo: { fatura: {...} }
          else if ('fatura' in billsResponse && billsResponse.fatura) {
            faturasArray = [billsResponse.fatura as BillsResponse['faturas'][0]];
          }
          // A resposta diretamente é um array
          else if (Array.isArray(billsResponse)) {
            faturasArray = billsResponse;
          }
          // Propriedade faturas existe mas não é array
          else if ('faturas' in billsResponse && billsResponse.faturas) {
            faturasArray = Array.isArray(billsResponse.faturas) 
              ? billsResponse.faturas 
              : [billsResponse.faturas];
          }
        }
        
        setBills(faturasArray);
        setLatestBill(faturasArray.length > 0 ? faturasArray[0] : null);
      } else {
        setBills([]);
        setLatestBill(null);
      }
      
      // Carregar histórico de consumo
      const consumptionResponse = await ApiService.getConsumption(matricula, 6);
      console.log('Resposta da API consumo:', JSON.stringify(consumptionResponse));
      
      if (consumptionResponse && typeof consumptionResponse === 'object') {
        if ('consumo' in consumptionResponse && Array.isArray(consumptionResponse.consumo)) {
          // Garantir que estatisticas existe no objeto
          if (!consumptionResponse.estatisticas) {
            // Criar estatísticas com base nos dados de consumo
            const consumoArray = consumptionResponse.consumo;
            const medio = consumoArray.length > 0 
              ? consumoArray.reduce((sum, item) => sum + item.consumo, 0) / consumoArray.length 
              : 0;
            
            const atual = consumoArray.length > 0 
              ? consumoArray[consumoArray.length - 1].consumo 
              : 0;
            
            // Adicionar estatísticas calculadas ao objeto
            consumptionResponse.estatisticas = { medio, atual };
          }
          
          setConsumptionData(consumptionResponse as ConsumptionResponse);
        } else if ('success' in consumptionResponse && consumptionResponse.success === true) {
          // Tenta encontrar dados de consumo em outra parte da resposta
          const consumoData = Object.values(consumptionResponse).find(
            value => value && Array.isArray(value) && value.length > 0 && 'consumo' in value[0]
          );
          
          if (consumoData) {
            // Calcular estatísticas com base nos dados de consumo
            const medio = consumoData.length > 0 
              ? consumoData.reduce((sum: number, item: any) => sum + item.consumo, 0) / consumoData.length 
              : 0;
            
            const atual = consumoData.length > 0 
              ? consumoData[consumoData.length - 1].consumo 
              : 0;
            
            setConsumptionData({
              ...consumptionResponse,
              consumo: consumoData,
              estatisticas: { medio, atual }
            } as ConsumptionResponse);
          }
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      // Não está autenticado - redirecionar para login 
      // (normalmente seria feito pelo AuthProvider, mas adicionamos como precaução)
      router.replace('/login');
    }
  }, [isAuthenticated, matricula]);
  
  useEffect(() => {
    // Executar diagnóstico para verificar importações React Native
    checkReactNativeImports();
  }, []);
  
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };
  
  if (loading) {
    return <LoadingIndicator fullScreen message="Carregando informações..." />;
  }
  
  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle size={48} color={colors.error} />}
        title="Ocorreu um erro"
        message={error}
      />
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? colors.darkBg : colors.lightBg }
    ]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            key={`home-refresh-control-${Date.now()}`}
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressViewOffset={10}
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        <HomeHeader 
          clientName={clientData?.nome}
          clientAddress={clientData?.endereco}
        />
        
        <View style={styles.cardsContainer}>
          <BillSummary latestBill={latestBill} />
          
          <ConsumptionSummary consumptionData={consumptionData} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  cardsContainer: {
    paddingHorizontal: 16,
  }
});