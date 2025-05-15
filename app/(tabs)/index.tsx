import React, { useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  useColorScheme,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { 
  ClientDataResponse, 
  BillsResponse, 
  ConsumptionResponse 
} from '@/services/api';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorRetry } from '@/components/ErrorRetry';
import { useAuth } from '@/contexts/AuthContext';

// Hooks do React Query
import { useClientData, useBills, useConsumption } from '@/hooks/query-hooks';

// Componentes refatorados
import { HomeHeader } from '@/components/home/HomeHeader';
import { BillSummary } from '@/components/home/BillSummary';
import { ConsumptionSummary } from '@/components/home/ConsumptionSummary';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { isAuthenticated } = useAuth();
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  // Verificar autenticação e redirecionar quando necessário
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);
  
  // Usar hooks do React Query para buscar dados
  const { 
    data: clientResponse,
    error: clientError,
    isLoading: isClientLoading,
    refetch: refetchClient
  } = useClientData();
  
  const {
    data: billsResponse,
    error: billsError,
    isLoading: isBillsLoading,
    refetch: refetchBills
  } = useBills({ limit: 5, status: 'aberto' });
  
  const {
    data: consumptionResponse,
    error: consumptionError,
    isLoading: isConsumptionLoading,
    refetch: refetchConsumption
  } = useConsumption({ limite: 6 });

  // Extrair dados das respostas
  const clientData = clientResponse?.cliente;
  const bills = billsResponse?.faturas || [];
  const latestBill = bills.length > 0 ? bills[0] : null;
  
  // Verificar se há erros
  const error = clientError || billsError || consumptionError;
  
  // Verificar se está carregando
  const isLoading = isClientLoading || isBillsLoading || isConsumptionLoading;
  
  // Animar componentes quando os dados forem carregados
  useEffect(() => {
    if (!isLoading && !error) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad)
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad)
        })
      ]).start();
    }
  }, [isLoading, error]);
  
  // Função para atualizar todos os dados
  const onRefresh = () => {
    refetchClient();
    refetchBills();
    refetchConsumption();
  };
  
  // Se não estiver autenticado, mostrar carregamento enquanto o redirecionamento ocorre
  if (!isAuthenticated) {
    return <LoadingIndicator fullScreen message="Verificando autenticação..." />;
  }
  
  if (isLoading) {
    return <LoadingIndicator fullScreen message="Carregando informações..." />;
  }
  
  if (error) {
    return (
      <ErrorRetry
        error={error as Error}
        onRetry={onRefresh}
        message="Não foi possível carregar os dados. Verifique sua conexão com a internet e tente novamente."
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
            refreshing={isLoading}
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
        
        <Animated.View 
          style={[
            styles.cardsContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <BillSummary latestBill={latestBill} />
          
          <ConsumptionSummary consumptionData={consumptionResponse || null} />
        </Animated.View>
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