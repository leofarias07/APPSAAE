import React from 'react';
import { View, Text, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory-native';
import { colors } from '@/constants/colors';
import { Card } from './Card';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

interface ConsumptionData {
  mes: string;
  ano: string;
  referencia: string;
  consumo: number;
}

interface ConsumptionStats {
  medio: number;
  atual: number;
}

interface ConsumptionChartProps {
  consumo: ConsumptionData[];
  estatisticas?: ConsumptionStats;
}

export function ConsumptionChart({ consumo, estatisticas }: ConsumptionChartProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (!consumo || consumo.length === 0) {
    return (
      <Card variant="elevated">
        <Text style={[
          styles.title,
          { color: isDark ? colors.textLight : colors.textDark }
        ]}>
          Histórico de Consumo
        </Text>
        <View style={styles.emptyContainer}>
          <Text style={[
            styles.emptyText,
            { color: isDark ? colors.textLight : colors.textMedium }
          ]}>
            Nenhum histórico de consumo disponível
          </Text>
        </View>
      </Card>
    );
  }

  const defaultMedio = consumo.reduce((sum, item) => sum + item.consumo, 0) / consumo.length;
  const defaultAtual = consumo[consumo.length - 1].consumo;
  const medio = estatisticas?.medio ?? defaultMedio;
  const atual = estatisticas?.atual ?? defaultAtual;

  const sortedData = [...consumo].sort((a, b) => {
    const dateA = new Date(`${a.ano}-${a.mes}-01`);
    const dateB = new Date(`${b.ano}-${b.mes}-01`);
    return dateA.getTime() - dateB.getTime();
  });

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const chartId = `consumption-chart-${sortedData.length}`;

  // Destaque para o mês mais recente
  const lastIndex = sortedData.length - 1;

  const chartData = sortedData.map((item, idx) => {
    const monthIndex = parseInt(item.mes) - 1;
    return {
      x: monthNames[monthIndex],
      y: item.consumo,
      label: item.consumo.toFixed(1),
      isCurrent: idx === lastIndex,
      id: `chart-item-${item.ano}-${item.mes}`
    };
  });

  const screenWidth = Dimensions.get('window').width - 64;
  const percentage = Math.round((atual / medio) * 100 - 100);
  const comparison = percentage > 0
    ? `${percentage}% acima da média`
    : percentage < 0
      ? `${Math.abs(percentage)}% abaixo da média`
      : 'Na média';
  const comparisonColor = percentage > 0
    ? colors.error
    : percentage < 0
      ? colors.success
      : colors.info;

  const getTrendIcon = () => {
    if (percentage > 0) {
      return <TrendingUp size={28} color={colors.error} style={styles.trendIcon} />;
    } else if (percentage < 0) {
      return <TrendingDown size={28} color={colors.success} style={styles.trendIcon} />;
    } else {
      return <Minus size={28} color={colors.info} style={styles.trendIcon} />;
    }
  };

  return (
    <Card variant="glass" style={styles.cardGlass}>
      <Text style={[
        styles.title,
        { color: isDark ? colors.textLight : colors.textDark }
      ]}>
        Histórico de Consumo
      </Text>

      <View style={styles.statsRow}>
        <LinearGradient
          colors={isDark ? [colors.primaryDark, colors.darkBgAlt] : [colors.primaryUltraLight, colors.primaryLighter]}
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.statLabel, { color: isDark ? colors.textLight : colors.textMedium }]}>Atual</Text>
          <Text style={[styles.statValue, { color: isDark ? colors.textLight : colors.primary }]}>{atual.toFixed(1)} m³</Text>
        </LinearGradient>
        <LinearGradient
          colors={isDark ? [colors.primaryDark, colors.darkBgAlt] : [colors.primaryUltraLight, colors.primaryLighter]}
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.statLabel, { color: isDark ? colors.textLight : colors.textMedium }]}>Média</Text>
          <Text style={[styles.statValue, { color: isDark ? colors.textLight : colors.primary }]}>{medio.toFixed(1)} m³</Text>
        </LinearGradient>
        <View style={[styles.statCard, styles.trendCard, { backgroundColor: isDark ? 'rgba(0,166,114,0.08)' : 'rgba(0,166,114,0.10)' }] }>
          {getTrendIcon()}
          <Text style={[styles.comparisonText, { color: comparisonColor }]}>{comparison}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <VictoryChart
          key={`chart-container-${chartId}`}
          width={screenWidth}
          height={220}
          domainPadding={{ x: 20 }}
          padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
          theme={VictoryTheme.material}
          animate={{ duration: 1000, onLoad: { duration: 500 } }}
          style={{ background: { fill: 'transparent' } }}
          containerComponent={<View />}
        >
          <Defs>
            <SvgLinearGradient id="currentBarGradientLight" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0%" stopColor={colors.primaryLight} stopOpacity={1} />
              <Stop offset="100%" stopColor={colors.primaryLighter} stopOpacity={0.8} />
            </SvgLinearGradient>
            <SvgLinearGradient id="currentBarGradientDark" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0%" stopColor={colors.primary} stopOpacity={1} />
              <Stop offset="100%" stopColor={colors.primaryDark} stopOpacity={0.8} />
            </SvgLinearGradient>
          </Defs>
          <VictoryAxis
            key={`axis-x-${chartId}`}
            tickFormat={(t) => t}
            style={{
              axis: { stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', strokeWidth: 1 },
              ticks: { stroke: 'transparent', size: 5 },
              grid: { stroke: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', strokeDasharray: '4' },
              tickLabels: {
                fill: isDark ? colors.textMuted : colors.textMedium,
                fontSize: 13,
                fontFamily: 'Poppins-SemiBold',
                padding: 8
              }
            }}
          />
          <VictoryAxis
            key={`axis-y-${chartId}`}
            dependentAxis
            tickFormat={(t) => `${t}`}
            style={{
              axis: { stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', strokeWidth: 1 },
              ticks: { stroke: 'transparent', size: 5 },
              grid: { stroke: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', strokeDasharray: '4' },
              tickLabels: {
                fill: isDark ? colors.textMuted : colors.textMedium,
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                padding: 5
              }
            }}
          />
          <VictoryBar
            key={`bar-chart-${chartId}`}
            data={chartData}
            x="x"
            y="y"
            labels={({ datum }) => `${datum.y.toFixed(1)}`}
            labelComponent={
              <VictoryLabel
                key={`label-component-${chartId}`}
                dy={-12}
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Medium',
                  fill: isDark ? colors.textLight : colors.primary
                }}
              />
            }
            style={{
              data: {
                fill: ({ datum }) => datum.isCurrent
                  ? (isDark
                    ? 'url(#currentBarGradientDark)'
                    : 'url(#currentBarGradientLight)')
                  : (isDark ? colors.primaryLight : colors.primaryLighter),
                width: 22,
                opacity: 0.95,
                stroke: ({ datum }) => datum.isCurrent ? colors.accent : 'transparent',
                strokeWidth: ({ datum }) => datum.isCurrent ? 2 : 0,
                borderRadius: 8
              }
            }}
            cornerRadius={{ top: 10 }}
            animate={{
              onExit: {
                duration: 500,
                before: () => ({ opacity: 0, y: 0 })
              },
              onEnter: {
                duration: 500,
                before: () => ({ opacity: 0, y: 0 }),
                after: (datum) => ({ opacity: 1, y: datum.y })
              }
            }}
          />
        </VictoryChart>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardGlass: {
    marginBottom: 16,
    borderWidth: 0,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    marginBottom: 18,
    letterSpacing: 0.2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    minWidth: 90,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    marginBottom: 4,
    textAlign: 'center',
    opacity: 0.85,
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    textAlign: 'center',
    color: colors.primary,
  },
  trendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    gap: 8,
  },
  comparisonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    textAlign: 'center',
  },
  trendIcon: {
    marginRight: 6,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
});