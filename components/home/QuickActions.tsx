import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { colors } from '@/constants/colors';
import { 
  Droplet, Receipt, AlertCircle, Gauge, CreditCard, Phone, 
  FileText, Clock, HelpCircle, Bell, BarChart, FileQuestion,
  Locate, Settings, Users
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Tipo para as abas
type TabType = 'services' | 'favorites' | 'documents';

export function QuickActions() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = React.useState<TabType>('services');

  const navigateToBills = () => {
    router.push('/(tabs)/bills');
  };

  const openSupport = () => {
    // Implementação futura para contato com suporte
    alert('Funcionalidade de suporte será implementada em breve!');
  };

  const reportIssue = () => {
    // Implementação futura para relatar problemas
    alert('Funcionalidade para relatar problemas será implementada em breve!');
  };
  
  const showComingSoon = (feature: string) => {
    alert(`A funcionalidade "${feature}" será implementada em breve!`);
  };
  
  // Renderiza os ícones com base na aba ativa
  const renderContent = () => {
    switch(activeTab) {
      case 'services':
        return renderServices();
      case 'favorites':
        return renderFavorites();
      case 'documents':
        return renderDocuments();
      default:
        return renderServices();
    }
  };
  
  // Serviços principais
  const renderServices = () => (
    <View style={styles.actionsGrid}>
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={navigateToBills}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.actionIconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <CreditCard size={20} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.actionText, isDark && styles.textLight]}>Faturas</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => showComingSoon('Medições')}
      >
        <LinearGradient
          colors={[colors.success, '#00CF8E']}
          style={styles.actionIconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Gauge size={20} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.actionText, isDark && styles.textLight]}>Medições</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={reportIssue}
      >
        <LinearGradient
          colors={[colors.error, '#FF5252']}
          style={styles.actionIconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <AlertCircle size={20} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.actionText, isDark && styles.textLight]}>Problemas</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => showComingSoon('Segunda via')}
      >
        <LinearGradient
          colors={['#6C5CE7', '#8C7AE6']}
          style={styles.actionIconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FileText size={20} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.actionText, isDark && styles.textLight]}>Segunda via</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => showComingSoon('Histórico')}
      >
        <LinearGradient
          colors={['#00B894', '#55EFC4']}
          style={styles.actionIconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Clock size={20} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.actionText, isDark && styles.textLight]}>Histórico</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={openSupport}
      >
        <LinearGradient
          colors={[colors.accent, '#FF9452']}
          style={styles.actionIconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Phone size={20} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.actionText, isDark && styles.textLight]}>Suporte</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => showComingSoon('Notificações')}
      >
        <LinearGradient
          colors={['#0984E3', '#74B9FF']}
          style={styles.actionIconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Bell size={20} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.actionText, isDark && styles.textLight]}>Alertas</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => showComingSoon('Ajuda')}
      >
        <LinearGradient
          colors={['#636E72', '#B2BEC3']}
          style={styles.actionIconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <HelpCircle size={20} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.actionText, isDark && styles.textLight]}>Ajuda</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Favoritos do usuário
  const renderFavorites = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIcon}>
        <Settings size={32} color={colors.textMedium} />
      </View>
      <Text style={styles.emptyStateTitle}>
        Personalize seus favoritos
      </Text>
      <Text style={styles.emptyStateDescription}>
        Adicione aqui os serviços que você mais utiliza para acesso rápido
      </Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={() => showComingSoon('Personalização de favoritos')}
      >
        <Text style={styles.emptyStateButtonText}>
          Personalizar
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  // Documentos e informações
  const renderDocuments = () => (
    <View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.documentScrollContent}
      >
        <TouchableOpacity 
          style={styles.documentCard}
          onPress={() => showComingSoon('Regulamento')}
        >
          <View style={[styles.documentIcon, { backgroundColor: 'rgba(0, 87, 183, 0.1)' }]}>
            <FileQuestion size={20} color={colors.primary} />
          </View>
          <Text style={styles.documentTitle}>Regulamento</Text>
          <Text style={styles.documentDescription}>Normas e regras do serviço</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.documentCard}
          onPress={() => showComingSoon('Tabela de tarifas')}
        >
          <View style={[styles.documentIcon, { backgroundColor: 'rgba(247, 107, 28, 0.1)' }]}>
            <BarChart size={20} color={colors.accent} />
          </View>
          <Text style={styles.documentTitle}>Tabela de tarifas</Text>
          <Text style={styles.documentDescription}>Valores e faixas de consumo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.documentCard}
          onPress={() => showComingSoon('Pontos de atendimento')}
        >
          <View style={[styles.documentIcon, { backgroundColor: 'rgba(0, 166, 114, 0.1)' }]}>
            <Locate size={20} color={colors.success} />
          </View>
          <Text style={styles.documentTitle}>Pontos de atendimento</Text>
          <Text style={styles.documentDescription}>Locais de atendimento presencial</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.documentCard}
          onPress={() => showComingSoon('Informações da conta')}
        >
          <View style={[styles.documentIcon, { backgroundColor: 'rgba(108, 92, 231, 0.1)' }]}>
            <Users size={20} color="#6C5CE7" />
          </View>
          <Text style={styles.documentTitle}>Dados cadastrais</Text>
          <Text style={styles.documentDescription}>Consulte e atualize seus dados</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <Card style={styles.container} variant="elevated">
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
          Acesso rápido
        </Text>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'services' && styles.tabActive
            ]}
            onPress={() => setActiveTab('services')}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === 'services' && styles.tabActiveText
              ]}
            >
              Serviços
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'favorites' && styles.tabActive
            ]}
            onPress={() => setActiveTab('favorites')}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === 'favorites' && styles.tabActiveText
              ]}
            >
              Favoritos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'documents' && styles.tabActive
            ]}
            onPress={() => setActiveTab('documents')}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === 'documents' && styles.tabActiveText
              ]}
            >
              Documentos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderContent()}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
    padding: 3,
  },
  tab: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  tabActive: {
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    color: colors.textMedium,
  },
  tabActiveText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.textDark,
  },
  textLight: {
    color: colors.textLight,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: colors.textMedium,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  documentScrollContent: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  documentCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 12,
    padding: 16,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 12,
    color: colors.textMedium,
    lineHeight: 16,
  },
}); 