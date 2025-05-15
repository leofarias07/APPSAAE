import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface ErrorRetryProps {
  error: Error | null;
  onRetry: () => void;
  message?: string;
}

export function ErrorRetry({ error, onRetry, message }: ErrorRetryProps) {
  const errorMessage = message || error?.message || 'Ocorreu um erro ao carregar os dados';
  
  return (
    <View style={styles.container}>
      <AlertCircle size={48} color={colors.error} />
      
      <Text style={styles.errorTitle}>Falha na conexão</Text>
      
      <Text style={styles.errorMessage}>
        {errorMessage}
      </Text>
      
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={onRetry}
        activeOpacity={0.7}
      >
        <RefreshCw size={18} color="#fff" />
        <Text style={styles.retryText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: colors.error,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
    maxWidth: '80%',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  retryText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  }
}); 