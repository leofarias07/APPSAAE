import React, { useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable,
  useColorScheme,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { BillCard } from '@/components/BillCard';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { EmptyState } from '@/components/EmptyState';
import { ClipboardList } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useClient } from '@/contexts/ClientContext';

type FilterStatus = 'todos' | 'aberto' | 'pago';

export default function BillsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const { matricula } = useAuth();
  const {
    faturas,
    loading,
    error,
    fetchFaturas
  } = useClient();

  const [filter, setFilter] = React.useState<FilterStatus>('todos');
  
  // Remover possíveis duplicatas e garantir que cada fatura tenha um identificador único
  // Agora também filtra status indesejados
  const uniqueBills = useMemo(() => {
    if (!faturas || !Array.isArray(faturas)) return [];
    
    // Filtrar faturas com status indesejado
    const faturasFiltradas = faturas.filter(fatura => {
      const statusUpper = (fatura.status || '').toUpperCase();
      return statusUpper !== 'ISENTO' && statusUpper !== 'CANCELADO POR REFATURAMENTO' && statusUpper !== 'CANCELADO';
    });
    
    // Usar um map para eliminar duplicatas baseado na combinação única id+parcela
    const uniqueMap = new Map();
    
    faturasFiltradas.forEach((fatura, index) => {
      const uniqueKey = `${fatura.id}-${fatura.parcela}`;
      if (!uniqueMap.has(uniqueKey)) {
        // Adicionar um identificador único baseado no índice original para garantir unicidade
        uniqueMap.set(uniqueKey, {
          ...fatura,
          // Propriedade interna usada apenas para a key do React, não afeta o resto do app
          _uniqueId: `${index}-${Date.now()}`
        });
      }
    });
    
    return Array.from(uniqueMap.values());
  }, [faturas]);

  useEffect(() => {
    if (matricula) {
      fetchFaturas(matricula, 20, filter);
    }
  }, [matricula, filter, fetchFaturas]);

  const onRefresh = () => {
    if (matricula) {
      fetchFaturas(matricula, 20, filter);
    }
  };

  const FilterButton = ({ 
    title, 
    active, 
    onPress 
  }: { 
    title: string, 
    active: boolean, 
    onPress: () => void 
  }) => (
    <Pressable
      style={({pressed}) => [
        styles.filterButton,
        active && { 
          backgroundColor: isDark ? colors.primary : colors.primaryLight,
          borderColor: colors.primary,
        },
        { borderColor: isDark ? colors.darkBorder : colors.lightBorder },
        pressed && { opacity: 0.8 }
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterButtonText,
          active && { color: isDark ? colors.white : colors.primary },
          { color: isDark ? colors.textLight : colors.textDark }
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );

  if (loading) {
    return <LoadingIndicator fullScreen message="Carregando faturas..." />;
  }

  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDark ? colors.darkBg : colors.lightBg }
    ]}>
      <Header title="Minhas Faturas" />
      <View style={styles.filtersContainer}>
        <FilterButton
          title="Todas"
          active={filter === 'todos'}
          onPress={() => setFilter('todos')}
        />
        <FilterButton
          title="Em Aberto"
          active={filter === 'aberto'}
          onPress={() => setFilter('aberto')}
        />
        <FilterButton
          title="Pagas"
          active={filter === 'pago'}
          onPress={() => setFilter('pago')}
        />
      </View>
      {error ? (
        <EmptyState title="Erro" message={error} />
      ) : (uniqueBills.length === 0) ? (
        <EmptyState
          title="Nenhuma fatura encontrada"
          message={`Não há faturas ${filter !== 'todos' ? 
            filter === 'aberto' ? 'em aberto' : 'pagas' : 
            ''} para exibir.`}
          icon={<ClipboardList size={48} color={colors.textMedium} />}
        />
      ) : (
        <FlatList
          key="bills-list"
          data={uniqueBills}
          keyExtractor={(item) => `bill-${item.id}-${item.parcela}-${item._uniqueId}`}
          onRefresh={onRefresh}
          refreshing={loading}
          renderItem={({ item }) => (
            <BillCard
              key={`bill-card-${item.id}-${item.parcela}-${item._uniqueId}`}
              id={item.id}
              parcela={item.parcela}
              valor={item.valor}
              dataVencimento={item.dataVencimento}
              dataEmissao={item.dataEmissao}
              status={item.status}
              referencia={item.referencia}
              onPress={() => router.push(`/bill-details/${item.id}/${item.parcela}`)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 32 }}
          removeClippedSubviews={true}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});