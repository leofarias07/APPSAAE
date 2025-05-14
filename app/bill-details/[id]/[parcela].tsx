import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  useColorScheme,
  Image,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { EmptyState } from '@/components/EmptyState';
import { ArrowLeft, Copy, Share2, CircleCheck as CheckCircle2, ReceiptText, CircleAlert as AlertCircle } from 'lucide-react-native';
import { formatCurrency, formatDate } from '@/utils/format';
import { useAuth } from '@/contexts/AuthContext';
import { useClient } from '@/contexts/ClientContext';

export default function BillDetailsScreen() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { matricula } = useAuth();
  const {
    detalheFatura,
    loading,
    error,
    fetchDetalheFatura
  } = useClient();

  const id = params.id as string;
  const parcela = params.parcela as string;

  useEffect(() => {
    if (matricula && id && parcela) {
      fetchDetalheFatura(matricula, id, parcela);
    }
  }, [matricula, id, parcela, fetchDetalheFatura]);

  if (loading) {
    return <LoadingIndicator fullScreen message="Carregando detalhes da fatura..." />;
  }

  if (error) {
    return <EmptyState title="Erro" message={error} />;
  }

  if (!detalheFatura) {
    return <EmptyState title="Fatura não encontrada" message="Não foi possível carregar os detalhes da fatura." />;
  }

  const isPaid = detalheFatura.status === 'pago';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? colors.darkBg : colors.lightBg }} contentContainerStyle={{ padding: 16 }}>
      <Header title="Detalhes da Fatura" />
      <Card>
        <View style={styles.billHeader}>
          <Text style={[
            styles.billTitle, 
            { color: isDark ? colors.textLight : colors.textDark }
          ]}>
            {detalheFatura.descricao}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isPaid ? colors.success : colors.warning }
          ]}>
            <Text style={styles.statusText}>
              {isPaid ? 'Pago' : 'Em aberto'}
            </Text>
          </View>
        </View>
        <Text style={[
          styles.referenceText, 
          { color: isDark ? colors.textLight : colors.textMedium }
        ]}>
          Referência: {detalheFatura.referencia}
        </Text>
        <View style={styles.amountContainer}>
          <Text style={[
            styles.amountLabel, 
            { color: isDark ? colors.textLight : colors.textMedium }
          ]}>
            Valor Total
          </Text>
          <Text style={[
            styles.amountValue, 
            { color: isDark ? colors.textLight : colors.textDark }
          ]}>
            {formatCurrency(detalheFatura.valor)}
          </Text>
        </View>
        <View style={styles.divider} />
        {/* Datas */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <View>
            <Text style={[styles.label, { color: colors.textMedium }]}>Vencimento</Text>
            <Text style={[styles.value, { color: isDark ? colors.textLight : colors.textDark }]}>{formatDate(detalheFatura.dataVencimento)}</Text>
          </View>
          <View>
            <Text style={[styles.label, { color: colors.textMedium }]}>Emissão</Text>
            <Text style={[styles.value, { color: isDark ? colors.textLight : colors.textDark }]}>{formatDate(detalheFatura.dataEmissao)}</Text>
          </View>
        </View>
        {/* Detalhamento */}
        <Text style={[styles.sectionTitle, { color: isDark ? colors.textLight : colors.textDark }]}>Detalhamento</Text>
        <View style={{ marginBottom: 8 }}>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: colors.textMedium }]}>Água</Text>
            <Text style={[styles.value, { color: isDark ? colors.textLight : colors.textDark }]}>{formatCurrency(detalheFatura.detalhamento.valorAgua)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: colors.textMedium }]}>Esgoto</Text>
            <Text style={[styles.value, { color: isDark ? colors.textLight : colors.textDark }]}>{formatCurrency(detalheFatura.detalhamento.valorEsgoto)}</Text>
          </View>
          {detalheFatura.detalhamento.valorServicos > 0 && (
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: colors.textMedium }]}>Serviços</Text>
              <Text style={[styles.value, { color: isDark ? colors.textLight : colors.textDark }]}>{formatCurrency(detalheFatura.detalhamento.valorServicos)}</Text>
            </View>
          )}
        </View>
        <View style={styles.divider} />
        {/* Consumo */}
        <Text style={[styles.sectionTitle, { color: isDark ? colors.textLight : colors.textDark }]}>Consumo</Text>
        <View style={{ marginBottom: 8 }}>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: colors.textMedium }]}>Consumo Total</Text>
            <Text style={[styles.value, { color: isDark ? colors.textLight : colors.textDark }]}>{detalheFatura.consumo.metros} m³</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: colors.textMedium }]}>Leitura Anterior</Text>
            <Text style={[styles.value, { color: isDark ? colors.textLight : colors.textDark }]}>{detalheFatura.consumo.leituraAnterior} m³</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: colors.textMedium }]}>Leitura Atual</Text>
            <Text style={[styles.value, { color: isDark ? colors.textLight : colors.textDark }]}>{detalheFatura.consumo.leituraAtual} m³</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: colors.textMedium }]}>Data da Leitura</Text>
            <Text style={[styles.value, { color: isDark ? colors.textLight : colors.textDark }]}>{detalheFatura.consumo.dataLeitura}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        {/* PIX */}
        {!isPaid && detalheFatura.pix && detalheFatura.pix.disponivel && (
          <>
            <Text style={[styles.sectionTitle, { color: isDark ? colors.textLight : colors.textDark }]}>Pagamento PIX</Text>
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              {detalheFatura.pix.qrCode && (
                <Image
                  key={`qr-code-${detalheFatura.id}-${detalheFatura.parcela}`}
                  source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(detalheFatura.pix.qrCode)}` }}
                  style={{ width: 180, height: 180, marginBottom: 12, borderRadius: 8 }}
                  resizeMode="contain"
                />
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={[styles.label, { color: colors.textMedium, marginRight: 8 }]}>Chave PIX:</Text>
                <Text style={[styles.value, { color: isDark ? colors.textLight : colors.textDark, fontSize: 13, maxWidth: 160 }]} numberOfLines={1} ellipsizeMode="middle">{detalheFatura.pix.chaveCopiaCola}</Text>
                <Button
                  title="Copiar"
                  variant="outlined"
                  size="small"
                  style={{ marginLeft: 8, height: 32, paddingHorizontal: 8 }}
                  onPress={() => {
                    if (detalheFatura.pix?.chaveCopiaCola) {
                      // @ts-ignore
                      if (navigator && navigator.clipboard) {
                        navigator.clipboard.writeText(detalheFatura.pix.chaveCopiaCola);
                        Alert.alert('PIX copiado!', 'Chave PIX copiada para a área de transferência.');
                      } else {
                        Alert.alert('PIX', detalheFatura.pix.chaveCopiaCola);
                      }
                    }
                  }}
                />
                <Button
                  title="Compartilhar"
                  variant="ghost"
                  size="small"
                  style={{ marginLeft: 4, height: 32, paddingHorizontal: 8 }}
                  onPress={async () => {
                    if (detalheFatura.pix?.chaveCopiaCola) {
                      try {
                        await Share.share({ message: detalheFatura.pix.chaveCopiaCola });
                      } catch {}
                    }
                  }}
                />
              </View>
            </View>
          </>
        )}
        {/* Mensagem para fatura paga */}
        {isPaid && (
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <CheckCircle2 size={48} color={colors.success} />
            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, color: colors.success, marginTop: 8 }}>Fatura Paga</Text>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textMedium, textAlign: 'center', marginTop: 4 }}>
              Esta fatura já foi quitada. Obrigado pelo pagamento!
            </Text>
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  billTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
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
  referenceText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginTop: 8,
  },
  amountContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  amountLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  amountValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightBorder,
    marginVertical: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    marginBottom: 6,
    marginTop: 8,
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  value: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});