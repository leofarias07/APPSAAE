import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, useColorScheme } from 'react-native';
import { colors } from '@/constants/colors';

interface LoadingIndicatorProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingIndicator({ 
  message = 'Carregando...', 
  fullScreen = false 
}: LoadingIndicatorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  if (fullScreen) {
    return (
      <View style={[
        styles.container, 
        styles.fullScreen, 
        { backgroundColor: isDark ? colors.darkBg : colors.lightBg }
      ]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[
          styles.message, 
          { color: isDark ? colors.textLight : colors.textDark }
        ]}>
          {message}
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={[
        styles.message, 
        { color: isDark ? colors.textLight : colors.textDark }
      ]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fullScreen: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  message: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginTop: 8,
  },
});