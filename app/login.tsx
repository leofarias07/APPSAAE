import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  Pressable,
  AccessibilityInfo,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { CircleAlert, XCircle, HelpCircle } from 'lucide-react-native';

export default function LoginScreen() {
  const [matricula, setMatricula] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const inputRef = useRef<TextInput>(null);

  // Cores dinâmicas baseadas no tema
  const backgroundColor = isDark ? colors.darkBg : colors.lightBg;
  const textColor = isDark ? colors.textLight : colors.textDark;
  const inputBackgroundColor = isDark ? '#1F1F1F' : '#F5F5F5';
  const inputBorderColor = matricula.trim().length === 0
    ? (isDark ? '#333333' : '#E0E0E0')
    : error
      ? colors.error
      : colors.success;

  useEffect(() => {
    // Foco automático no campo de matrícula
    inputRef.current?.focus();
  }, []);

  // Novo useEffect para lidar com a navegação
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    if (!matricula.trim()) {
      setError('Por favor, digite sua matrícula');
      return;
    }
    setError(null);
    try {
      setIsLoading(true);
      await login(matricula.trim());
      // O redirecionamento acontecerá automaticamente pelo efeito de autenticação
    } catch (error) {
      setError('Matrícula inválida ou erro na conexão. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Exibir indicador de carregamento enquanto verifica a autenticação
  if (authLoading) {
    return <LoadingIndicator />;
  }

  // Mostrar indicador de carregamento enquanto o redirecionamento acontece
  if (isAuthenticated) {
    return <LoadingIndicator fullScreen message="Entrando..." />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Logo AquaLink"
          />
          <Text style={[styles.appName, { color: textColor }]}>SAAE CAXIAS</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: textColor }]}>Seja bem-vindo!</Text>
          <Text style={[styles.subtitle, { color: textColor }]}>Digite sua matrícula para acessar sua conta</Text>
          <View style={styles.inputContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.label, { color: textColor }]}>Matrícula</Text>
              <Pressable
                onPress={() => setShowHelp(true)}
                accessibilityLabel="Ajuda sobre matrícula"
                style={{ marginLeft: 8 }}
              >
                <HelpCircle size={18} color={colors.info} />
              </Pressable>
            </View>
            <View style={{ position: 'relative' }}>
              <TextInput
                ref={inputRef}
                style={[
                  styles.input,
                  { 
                    backgroundColor: inputBackgroundColor,
                    borderColor: inputBorderColor,
                    color: textColor 
                  }
                ]}
                placeholder="Digite sua matrícula"
                placeholderTextColor={isDark ? '#888888' : '#AAAAAA'}
                keyboardType="number-pad"
                value={matricula}
                onChangeText={text => {
                  setMatricula(text);
                  setError(null);
                }}
                autoCapitalize="none"
                maxLength={12}
                accessible
                accessibilityLabel="Campo de matrícula"
                accessibilityHint="Digite o número da sua matrícula"
                returnKeyType="done"
                importantForAutofill="yes"
                selectTextOnFocus
                autoFocus
              />
              {matricula.length > 0 && (
                <Pressable
                  onPress={() => setMatricula('')}
                  style={styles.clearButton}
                  accessibilityLabel="Limpar matrícula"
                >
                  <XCircle size={20} color={colors.textMuted} />
                </Pressable>
              )}
            </View>
            {error && (
              <View style={styles.errorContainer}>
                <CircleAlert size={16} color={colors.error} style={{ marginRight: 4 }} />
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            )}
          </View>
          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={isLoading}
            disabled={!matricula.trim() || isLoading}
            style={styles.loginButton}
            size="large"
            fullWidth
          />
          <Text style={[styles.helpText, { color: textColor }]}>Sua matrícula está no canto superior direito da sua fatura de água</Text>
        </View>
        {/* Modal de ajuda */}
        {showHelp && (
          <View style={styles.helpModalOverlay}>
            <View style={styles.helpModal} accessible accessibilityLabel="Ajuda sobre matrícula">
              <Text style={styles.helpModalTitle}>Onde encontrar sua matrícula?</Text>
              <Text style={styles.helpModalText}>
                Sua matrícula está localizada no canto superior direito da sua fatura de água. Caso não encontre, entre em contato com o suporte da SAAE.
              </Text>
              <Button
                title="Fechar"
                onPress={() => setShowHelp(false)}
                style={{ marginTop: 16 }}
              />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 32,
    opacity: 0.8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 18,
    zIndex: 2,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
    marginBottom: 24,
    height: 60,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    opacity: 0.7,
  },
  helpModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  helpModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  helpModalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    color: colors.primary,
    textAlign: 'center',
  },
  helpModalText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: colors.textDark,
    textAlign: 'center',
  },
}); 