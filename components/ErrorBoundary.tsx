import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Você também pode registrar o erro em um serviço de relatórios de erros
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
    this.setState({
      errorInfo
    });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Se fornecido um fallback personalizado, use-o
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Caso contrário, use o fallback padrão
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <AlertTriangle size={64} color={colors.error} style={styles.icon} />
            <Text style={styles.title}>Oops, algo deu errado!</Text>
            <Text style={styles.message}>
              Ocorreu um erro inesperado no aplicativo. Por favor, tente novamente.
            </Text>
            
            <ScrollView style={styles.detailsContainer}>
              <Text style={styles.errorTitle}>Detalhes do Erro:</Text>
              <Text style={styles.errorText}>{this.state.error?.toString()}</Text>
              {this.state.errorInfo && (
                <Text style={styles.errorStack}>
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={styles.resetButton}
              onPress={this.resetError}
              activeOpacity={0.7}
            >
              <RefreshCw size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.resetButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: colors.textDark,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.textMedium,
    marginBottom: 24,
    textAlign: 'center',
  },
  detailsContainer: {
    maxHeight: 200,
    width: '100%',
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  errorTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: colors.textDark,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.error,
    marginBottom: 8,
  },
  errorStack: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textMedium,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  buttonIcon: {
    marginRight: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
}); 