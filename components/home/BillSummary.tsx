import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/format';
import { BillsResponse } from '@/services/api';
import { Calendar, ArrowRight, AlertTriangle, Clock } from 'lucide-react-native';
import { format, isAfter, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type BillSummaryProps = {
  latestBill: BillsResponse['faturas'][0] | null;
};

export function BillSummary({ latestBill }: BillSummaryProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const navigateToBillDetails = () => {
    if (latestBill && latestBill.id) {
      router.push(`/bill-details/${latestBill.id}/${latestBill.parcela || 1}`);
    }
  };

  // Verifica se a fatura está atrasada
  const isOverdue = latestBill?.dataVencimento ? checkIfOverdue(latestBill.dataVencimento) : false;
  
  // Verifica se a fatura está prestes a vencer (menos de 5 dias)
  const isDueSoon = latestBill?.dataVencimento ? checkIfDueSoon(latestBill.dataVencimento) : false;
  
  // Formata a data de vencimento de maneira mais amigável
  const formattedDueDate = latestBill?.dataVencimento ? formatDueDate(latestBill.dataVencimento) : 'Não informado';
  
  // Status personalizado baseado na situação da fatura
  const billStatus = getBillStatus(latestBill, isOverdue, isDueSoon);

  return (
    <Card 
      style={styles.billCard} 
      variant="elevated"
      onPress={latestBill ? navigateToBillDetails : undefined}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            Fatura atual
          </Text>
          <View style={[
            styles.statusIndicator, 
            billStatus.colorStyle
          ]}>
            <Text style={[styles.statusText, billStatus.textStyle]}>
              {billStatus.label}
            </Text>
          </View>
        </View>
      </View>
      
      {latestBill ? (
        <>
          <View style={styles.billContent}>
            <View style={styles.valueContainer}>
              <Text style={styles.valueLabel}>Valor total</Text>
              <Text style={[styles.billValue, isOverdue && styles.overdueValue]}>
                {formatCurrency(latestBill.valor || 0)}
              </Text>
              {isOverdue && (
                <View style={styles.warningContainer}>
                  <AlertTriangle size={14} color={colors.error} />
                  <Text style={styles.warningText}>
                    Fatura vencida
                  </Text>
                </View>
              )}
              {isDueSoon && !isOverdue && (
                <View style={styles.warningContainer}>
                  <Clock size={14} color={colors.warning} />
                  <Text style={styles.dueSoonText}>
                    Vencendo em breve
                  </Text>
                </View>
              )}
            </View>
            
            <View style={[
              styles.dueDateContainer,
              isOverdue && styles.overdueDateContainer,
              isDueSoon && !isOverdue && styles.dueSoonDateContainer
            ]}>
              <View style={styles.dueDateIconContainer}>
                <Calendar size={18} color={isOverdue ? colors.error : isDueSoon ? colors.warning : colors.primary} />
              </View>
              <View>
                <Text style={styles.dueDateLabel}>Vencimento</Text>
                <Text style={[
                  styles.dueDate,
                  isOverdue && styles.overdueDateText,
                  isDueSoon && !isOverdue && styles.dueSoonDateText
                ]}>
                  {formattedDueDate}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.referenceContainer}>
            <Text style={styles.referenceLabel}>
              Referente a: 
            </Text>
            <Text style={styles.referenceValue}>
              {formatReference(latestBill.referencia || '')}
            </Text>
          </View>
          
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Ver detalhes completos</Text>
            <ArrowRight size={16} color={isDark ? colors.primaryLight : colors.primary} />
          </View>
        </>
      ) : (
        <View style={styles.noBillContainer}>
          <Text style={[styles.noBillText, isDark && styles.textLight]}>
            Você não possui faturas em aberto
          </Text>
          <Text style={styles.noBillSubtext}>
            Todas as suas contas estão em dia!
          </Text>
        </View>
      )}
    </Card>
  );
}

// Verifica se a data de vencimento já passou
function checkIfOverdue(dueDateStr: string): boolean {
  // Formato esperado: DD/MM/YYYY
  const [day, month, year] = dueDateStr.split('/').map(Number);
  const dueDate = new Date(year, month - 1, day); // Mês é 0-based
  const today = new Date();
  
  // Resetar as horas para comparar apenas as datas
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  
  return isAfter(today, dueDate);
}

// Verifica se a data de vencimento está próxima (5 dias ou menos)
function checkIfDueSoon(dueDateStr: string): boolean {
  const [day, month, year] = dueDateStr.split('/').map(Number);
  const dueDate = new Date(year, month - 1, day);
  const today = new Date();
  
  // Resetar as horas para comparar apenas as datas
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  
  // Não está vencida, mas vence em 5 dias ou menos
  return !isAfter(today, dueDate) && differenceInDays(dueDate, today) <= 5;
}

// Formata a data de vencimento para exibição amigável
function formatDueDate(dueDateStr: string): string {
  try {
    const [day, month, year] = dueDateStr.split('/').map(Number);
    const dueDate = new Date(year, month - 1, day);
    
    return format(dueDate, "dd 'de' MMM", { locale: ptBR });
  } catch (error) {
    return dueDateStr;
  }
}

// Formata a referência para exibição amigável
function formatReference(reference: string): string {
  if (!reference) return '';
  
  try {
    const [month, year] = reference.split('/');
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return `${monthNames[parseInt(month) - 1]} de ${year}`;
  } catch (error) {
    return reference;
  }
}

// Determina o status personalizado da fatura
function getBillStatus(
  bill: BillsResponse['faturas'][0] | null,
  isOverdue: boolean,
  isDueSoon: boolean
) {
  if (!bill) {
    return {
      label: 'NENHUMA FATURA',
      colorStyle: styles.statusNeutral,
      textStyle: styles.statusTextNeutral
    };
  }
  
  if (isOverdue) {
    return {
      label: 'VENCIDA',
      colorStyle: styles.statusOverdue,
      textStyle: styles.statusTextOverdue
    };
  }
  
  if (isDueSoon) {
    return {
      label: 'VENCE EM BREVE',
      colorStyle: styles.statusDueSoon,
      textStyle: styles.statusTextDueSoon
    };
  }
  
  return {
    label: 'EM ABERTO',
    colorStyle: styles.statusActive,
    textStyle: styles.statusTextActive
  };
}

const styles = StyleSheet.create({
  billCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginRight: 10,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: 'rgba(247, 107, 28, 0.15)',
  },
  statusOverdue: {
    backgroundColor: 'rgba(224, 49, 49, 0.15)',
  },
  statusDueSoon: {
    backgroundColor: 'rgba(247, 167, 28, 0.15)',
  },
  statusNeutral: {
    backgroundColor: 'rgba(82, 105, 144, 0.15)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTextActive: {
    color: colors.accent,
  },
  statusTextOverdue: {
    color: colors.error,
  },
  statusTextDueSoon: {
    color: colors.warning,
  },
  statusTextNeutral: {
    color: colors.textMedium,
  },
  billContent: {
    marginBottom: 16,
  },
  valueContainer: {
    marginBottom: 16,
  },
  valueLabel: {
    fontSize: 14,
    color: colors.textMedium,
    marginBottom: 4,
  },
  billValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  overdueValue: {
    color: colors.error,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  warningText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  dueSoonText: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 87, 183, 0.08)',
    padding: 12,
    borderRadius: 8,
  },
  overdueDateContainer: {
    backgroundColor: 'rgba(224, 49, 49, 0.08)',
  },
  dueSoonDateContainer: {
    backgroundColor: 'rgba(247, 107, 28, 0.08)',
  },
  dueDateIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dueDateLabel: {
    fontSize: 12,
    color: colors.textMedium,
  },
  dueDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  overdueDateText: {
    color: colors.error,
  },
  dueSoonDateText: {
    color: colors.warning,
  },
  referenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  referenceLabel: {
    fontSize: 13,
    color: colors.textMedium,
  },
  referenceValue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textDark,
    marginLeft: 4,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 12,
  },
  footerText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 6,
    fontWeight: '500',
  },
  noBillContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noBillText: {
    fontSize: 16,
    color: colors.textMedium,
    textAlign: 'center',
    marginBottom: 8,
  },
  noBillSubtext: {
    fontSize: 14,
    color: colors.success,
    textAlign: 'center',
  },
  textLight: {
    color: colors.textLight,
  },
}); 