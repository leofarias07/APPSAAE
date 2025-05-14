import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  useColorScheme,
  Linking,
  Pressable,
  Alert,
} from 'react-native';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { EmptyState } from '@/components/EmptyState';
import { User, MapPin, FileText, Settings, Info, LogOut, Phone, Mail, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useClient } from '@/contexts/ClientContext';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { matricula, logout } = useAuth();
  const {
    cliente,
    loading,
    error,
    fetchCliente
  } = useClient();

  useEffect(() => {
    if (matricula) {
      fetchCliente(matricula);
    }
  }, [matricula, fetchCliente]);

  if (loading) {
    return <LoadingIndicator fullScreen message="Carregando dados do perfil..." />;
  }

  if (error) {
    return <EmptyState title="Erro" message={error} />;
  }

  if (!cliente) {
    return <EmptyState title="Perfil não encontrado" message="Não foi possível carregar os dados do cliente." />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? colors.darkBg : colors.lightBg }} contentContainerStyle={{ padding: 16 }}>
      <Header title="Perfil" />
      <Card>
        <View style={styles.row}>
          <User size={32} color={isDark ? colors.primaryLight : colors.primaryDark} />
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.name, { color: isDark ? colors.textLight : colors.textDark }]}>{cliente.nome}</Text>
            <Text style={[styles.matricula, { color: colors.textMedium }]}>Matrícula: {cliente.matricula}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <MapPin size={20} color={colors.info} />
          <Text style={[styles.infoText, { color: isDark ? colors.textLight : colors.textMedium }]}>{cliente.endereco}</Text>
        </View>
        <View style={styles.infoRow}>
          <FileText size={20} color={colors.info} />
          <Text style={[styles.infoText, { color: isDark ? colors.textLight : colors.textMedium }]}>{cliente.documento}</Text>
        </View>
      </Card>
      <Button
        title="Sair"
        variant="outline"
        icon={<LogOut size={18} color={colors.error} />}
        textStyle={{ color: colors.error }}
        onPress={() => {
          Alert.alert('Sair', 'Deseja realmente sair?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: logout }
          ]);
        }}
        style={{ marginTop: 24 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  matricula: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightBorder,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginLeft: 8,
  },
});