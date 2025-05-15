import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { colors } from '@/constants/colors';

interface NetworkStatusProps {
  onRetry?: () => void;
}

export function NetworkStatus({ onRetry }: NetworkStatusProps) {
  const [isOffline, setIsOffline] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-100)).current;
  
  useEffect(() => {
    // Inscrever-se para receber atualizações de status de rede
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    
    // Verificar status inicial
    checkNetworkStatus();
    
    return () => {
      // Desinscrever ao desmontar
      unsubscribe();
    };
  }, []);
  
  const checkNetworkStatus = async () => {
    try {
      const state = await NetInfo.fetch();
      handleConnectivityChange(state);
    } catch (error) {
      console.error('Erro ao verificar status da rede:', error);
    }
  };
  
  const handleConnectivityChange = (state: NetInfoState) => {
    const offline = !state.isConnected || !state.isInternetReachable;
    
    if (offline !== isOffline) {
      setIsOffline(offline);
      
      // Animar o componente
      Animated.timing(slideAnim, {
        toValue: offline ? 0 : -100,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handleRetry = () => {
    checkNetworkStatus();
    if (onRetry) onRetry();
  };
  
  if (!isOffline) return null;
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.content}>
        <WifiOff size={20} color={colors.white} style={styles.icon} />
        <Text style={styles.text}>Sem conexão com a internet</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={handleRetry}
          activeOpacity={0.7}
        >
          <RefreshCw size={16} color={colors.white} />
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.error,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    color: colors.white,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  retryText: {
    color: colors.white,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
}); 