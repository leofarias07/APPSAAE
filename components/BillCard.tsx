import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { colors } from '@/constants/colors';
import { Card } from './Card';
import { formatCurrency } from '@/utils/format';

interface BillCardProps {
  id: string;
  parcela: number;
  valor: number;
  dataVencimento: string;
  dataEmissao: string;
  status: 'aberto' | 'pago';
  referencia: string;
  onPress: () => void;
}

export function BillCard({
  id,
  parcela,
  valor,
  dataVencimento,
  dataEmissao,
  status,
  referencia,
  onPress,
}: BillCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Parse Brazilian date format (dd/mm/yyyy) to Date object
  const parseDate = (dateString: string) => {
    return parse(dateString, 'dd/MM/yyyy', new Date());
  };
  
  // Format reference (mm/yyyy) to month name and year
  const formatReference = (ref: string) => {
    const [month, year] = ref.split('/');
    return format(new Date(Number(year), Number(month) - 1), 'MMMM yyyy', { locale: ptBR });
  };
  
  const vencimentoDate = parseDate(dataVencimento);
  const formattedReference = formatReference(referencia);
  
  const statusColor = status === 'aberto' ? colors.warning : colors.success;
  const statusText = status === 'aberto' ? 'Em aberto' : 'Pago';
  
  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={[
            styles.reference, 
            { color: isDark ? colors.textLight : colors.textDark }
          ]}>
            {formattedReference}
          </Text>
          <Text style={[
            styles.id, 
            { color: isDark ? colors.textLight : colors.textMedium }
          ]}>
            Fatura #{id}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={[
            styles.detailLabel, 
            { color: isDark ? colors.textLight : colors.textMedium }
          ]}>
            Valor
          </Text>
          <Text style={[
            styles.amount, 
            { color: isDark ? colors.textLight : colors.textDark }
          ]}>
            {formatCurrency(valor)}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={[
            styles.detailLabel, 
            { color: isDark ? colors.textLight : colors.textMedium }
          ]}>
            Vencimento
          </Text>
          <Text style={[
            styles.date, 
            { color: isDark ? colors.textLight : colors.textDark }
          ]}>
            {format(vencimentoDate, 'dd MMM yyyy', { locale: ptBR })}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reference: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  id: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightBorder,
    marginVertical: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginBottom: 2,
  },
  amount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  date: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});