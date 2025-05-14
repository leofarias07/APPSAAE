import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Card } from '@/components/Card';
import { ConsumptionChart } from '@/components/ConsumptionChart';
import { ConsumptionResponse } from '@/services/api';
import { colors } from '@/constants/colors';
import { Droplet, TrendingUp, LineChart, ChevronDown, ChevronUp, CheckCircle, BarChart2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type ConsumptionSummaryProps = {
  consumptionData: ConsumptionResponse | null;
};

export function ConsumptionSummary({ consumptionData }: ConsumptionSummaryProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showMoreDetails, setShowMoreDetails] = React.useState(false);

  // Calcular dados de consumo atual e média
  const consumptionStats = consumptionData?.estatisticas || { atual: 0, medio: 0 };
  const actualConsumption = consumptionStats.atual;
  const averageConsumption = consumptionStats.medio;
  
  // Obter dados da última leitura
  const lastReading = consumptionData?.ultimaLeitura || { 
    valor: 0, 
    data: "--/--/----", 
    leituraAnterior: 0, 
    leituraAtual: 0 
  };
  
  // Verificar se o consumo atual é maior que a média
  const isAboveAverage = actualConsumption > averageConsumption;
  
  // Calcular porcentagem de diferença
  const percentageDiff = averageConsumption > 0 
    ? Math.round(((actualConsumption - averageConsumption) / averageConsumption) * 100) 
    : 0;
    
  // Calcular tendência com base nos últimos meses
  const consumptionTrend = calculateConsumptionTrend(consumptionData?.consumo || []);

  // Calcular economia de água (em litros)
  const waterSavings = !isAboveAverage && averageConsumption > 0 
    ? Math.abs(actualConsumption - averageConsumption) * 1000 // Convertendo m³ para litros
    : 0;

  // Dicas de economia baseadas no consumo
  const savingTips = getSavingTips(isAboveAverage, consumptionTrend);

  return (
    <Card 
      style={styles.consumptionCard}
      variant="elevated"
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
          Consumo de água
        </Text>
        <View style={styles.chartIconContainer}>
          <LineChart size={16} color={colors.primary} />
        </View>
      </View>

      {consumptionData ? (
        <>
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={[
                isDark ? 'rgba(0, 87, 183, 0.8)' : 'rgba(0, 87, 183, 0.1)', 
                isDark ? 'rgba(0, 87, 183, 0.3)' : 'rgba(0, 119, 217, 0.05)'
              ]}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statIconContainer}>
                <Droplet size={18} color={colors.primary} />
              </View>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                Atual
              </Text>
              <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                {actualConsumption} m³
              </Text>
              {lastReading.data !== "--/--/----" && (
                <Text style={[styles.statMetaInfo, isDark && styles.statMetaInfoDark]}>
                  Última leitura: {lastReading.data}
                </Text>
              )}
            </LinearGradient>

            <LinearGradient
              colors={[
                isDark ? 'rgba(0, 119, 217, 0.8)' : 'rgba(0, 119, 217, 0.1)', 
                isDark ? 'rgba(0, 119, 217, 0.3)' : 'rgba(0, 148, 233, 0.05)'
              ]}
              style={[styles.statCard, { marginLeft: 12 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statIconContainer}>
                <TrendingUp size={18} color={colors.primaryLight} />
              </View>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                Média
              </Text>
              <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                {averageConsumption.toFixed(1)} m³
              </Text>
              <Text style={[styles.statMetaInfo, isDark && styles.statMetaInfoDark]}>
                Últimos 6 meses
              </Text>
            </LinearGradient>
          </View>

          {isAboveAverage && percentageDiff !== 0 && (
            <View style={styles.alertContainer}>
              <Text style={styles.alertText}>
                Seu consumo está {percentageDiff}% acima da média
              </Text>
            </View>
          )}

          {!isAboveAverage && percentageDiff !== 0 && waterSavings > 0 && (
            <View style={[styles.alertContainer, styles.goodAlertContainer]}>
              <View style={styles.savingsIconContainer}>
                <CheckCircle size={18} color={colors.success} />
              </View>
              <View>
                <Text style={[styles.alertText, styles.goodAlertText]}>
                  Parabéns pela economia!
                </Text>
                <Text style={styles.savingsText}>
                  Você economizou aproximadamente {Math.round(waterSavings)} litros de água
                </Text>
              </View>
            </View>
          )}
          
          {consumptionTrend !== 'stable' && (
            <View style={[
              styles.trendContainer,
              consumptionTrend === 'decreasing' ? styles.goodTrendContainer : styles.badTrendContainer
            ]}>
              <View style={styles.trendIconContainer}>
                {consumptionTrend === 'decreasing' ? (
                  <ChevronDown size={16} color={colors.success} />
                ) : (
                  <ChevronUp size={16} color={colors.warning} />
                )}
              </View>
              <View style={styles.trendTextContainer}>
                <Text style={[
                  styles.trendText,
                  consumptionTrend === 'decreasing' ? styles.goodTrendText : styles.badTrendText
                ]}>
                  {consumptionTrend === 'decreasing' 
                    ? 'Seu consumo está diminuindo nos últimos meses' 
                    : 'Seu consumo está aumentando nos últimos meses'}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.chartContainer}>
            <ConsumptionChart consumo={consumptionData.consumo} estatisticas={consumptionData.estatisticas} />
          </View>
          
          <TouchableOpacity 
            style={styles.detailsToggle}
            onPress={() => setShowMoreDetails(!showMoreDetails)}
          >
            <Text style={styles.detailsToggleText}>
              {showMoreDetails ? 'Ocultar detalhes' : 'Ver mais detalhes'}
            </Text>
            {showMoreDetails ? (
              <ChevronUp size={16} color={colors.primary} />
            ) : (
              <ChevronDown size={16} color={colors.primary} />
            )}
          </TouchableOpacity>
          
          {showMoreDetails && (
            <View style={styles.moreDetailsContainer}>
              <View style={styles.readingInfoContainer}>
                <View style={styles.readingInfoItem}>
                  <Text style={styles.readingInfoLabel}>Leitura anterior:</Text>
                  <Text style={styles.readingInfoValue}>
                    {lastReading.leituraAnterior} m³
                  </Text>
                </View>
                <View style={styles.readingInfoItem}>
                  <Text style={styles.readingInfoLabel}>Leitura atual:</Text>
                  <Text style={styles.readingInfoValue}>
                    {lastReading.leituraAtual} m³
                  </Text>
                </View>
              </View>
              
              <View style={styles.separator} />
              
              <View style={styles.tipsContainer}>
                <View style={styles.tipsHeader}>
                  <BarChart2 size={16} color={colors.primary} />
                  <Text style={styles.tipsTitle}>Dicas para você</Text>
                </View>
                
                {savingTips.map((tip, index) => {
                  // Criar um hash simplificado do conteúdo para parte da chave
                  const tipHash = tip
                    .substring(0, 15)
                    .replace(/\s+/g, '-')
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '');
                    
                  return (
                    <View 
                      key={`consumption-saving-tip-${index}-${tipHash}`} 
                      style={styles.tipItem}
                    >
                      <View style={styles.tipBullet} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, isDark && styles.textLight]}>
            Não há dados de consumo disponíveis
          </Text>
        </View>
      )}
    </Card>
  );
}

// Calcula a tendência de consumo com base nos últimos meses
function calculateConsumptionTrend(
  consumptionData: { mes: string; ano: string; referencia: string; consumo: number }[]
): 'increasing' | 'decreasing' | 'stable' {
  if (!consumptionData || consumptionData.length < 3) return 'stable';
  
  // Pegar os três últimos meses com consumo > 0
  const validData = [...consumptionData]
    .filter(item => item.consumo > 0)
    .slice(0, 3);
  
  if (validData.length < 3) return 'stable';
  
  // Calcular a diferença média percentual
  let differencesSum = 0;
  
  // Compare each month with the next
  for (let i = 0; i < validData.length - 1; i++) {
    const currentMonth = validData[i].consumo;
    const nextMonth = validData[i + 1].consumo;
    
    if (nextMonth === 0) continue;
    
    const percentDiff = ((currentMonth - nextMonth) / nextMonth) * 100;
    differencesSum += percentDiff;
  }
  
  const avgDifference = differencesSum / (validData.length - 1);
  
  if (avgDifference > 10) return 'increasing';
  if (avgDifference < -10) return 'decreasing';
  return 'stable';
}

// Retorna dicas de economia baseadas no perfil de consumo
function getSavingTips(isAboveAverage: boolean, trend: 'increasing' | 'decreasing' | 'stable'): string[] {
  const basicTips = [
    'Feche a torneira enquanto escova os dentes para economizar até 12 litros por minuto',
    'Tome banhos mais curtos. Cada minuto a menos economiza 20 litros',
    'Conserte vazamentos. Um pequeno gotejamento pode desperdiçar 46 litros por dia'
  ];
  
  if (isAboveAverage && trend === 'increasing') {
    return [
      'Seu consumo está alto e aumentando. Reavalie os hábitos de uso da água',
      'Instale redutores de vazão nas torneiras para economia de até 50%',
      'Considere coletar água da chuva para regar plantas e outras tarefas',
      ...basicTips
    ];
  }
  
  if (isAboveAverage) {
    return [
      'Seu consumo está acima da média. Pequenas mudanças podem ter grande impacto',
      'Lave o carro com balde em vez de mangueira para economizar 300 litros',
      ...basicTips
    ];
  }
  
  if (trend === 'increasing') {
    return [
      'Seu consumo está aumentando. Fique atento a possíveis vazamentos',
      'Use a máquina de lavar sempre com carga completa',
      ...basicTips
    ];
  }
  
  if (trend === 'decreasing') {
    return [
      'Ótimo trabalho! Você está no caminho certo para economizar água',
      'Continue mantendo bons hábitos de consumo',
      'Compartilhe suas práticas de economia com amigos e família'
    ];
  }
  
  return basicTips;
}

const styles = StyleSheet.create({
  consumptionCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  chartIconContainer: {
    backgroundColor: 'rgba(0, 87, 183, 0.1)',
    borderRadius: 6,
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textMedium,
    marginBottom: 4,
  },
  statLabelDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  statValueDark: {
    color: 'white',
  },
  statMetaInfo: {
    fontSize: 11,
    color: colors.textMedium,
    marginTop: 4,
  },
  statMetaInfoDark: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  alertContainer: {
    backgroundColor: 'rgba(247, 107, 28, 0.15)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goodAlertContainer: {
    backgroundColor: 'rgba(0, 166, 114, 0.15)',
  },
  savingsIconContainer: {
    marginRight: 8,
  },
  alertText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
  goodAlertText: {
    color: colors.success,
  },
  savingsText: {
    color: colors.success,
    fontSize: 12,
    marginTop: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  goodTrendContainer: {
    backgroundColor: 'rgba(0, 166, 114, 0.08)',
  },
  badTrendContainer: {
    backgroundColor: 'rgba(247, 107, 28, 0.08)',
  },
  trendIconContainer: {
    marginRight: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendTextContainer: {
    flex: 1,
  },
  trendText: {
    fontSize: 13,
    fontWeight: '500',
  },
  goodTrendText: {
    color: colors.success,
  },
  badTrendText: {
    color: colors.warning,
  },
  chartContainer: {
    marginTop: 8,
    height: 160,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 8,
  },
  detailsToggleText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  moreDetailsContainer: {
    marginTop: 8,
  },
  readingInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 87, 183, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  readingInfoItem: {
    flex: 1,
  },
  readingInfoLabel: {
    fontSize: 12,
    color: colors.textMedium,
    marginBottom: 2,
  },
  readingInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textDark,
  },
  separator: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 16,
  },
  tipsContainer: {
    padding: 4,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginLeft: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: 8,
  },
  tipText: {
    fontSize: 13,
    color: colors.textMedium,
    flex: 1,
    lineHeight: 18,
  },
  noDataContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: colors.textMedium,
    textAlign: 'center',
  },
  textLight: {
    color: colors.textLight,
  },
}); 