import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { colors } from '@/constants/colors';
import { CircleAlert as AlertCircle } from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  message, 
  icon = <AlertCircle size={48} color={colors.textMedium} /> 
}: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={[
        styles.title, 
        { color: isDark ? colors.textLight : colors.textDark }
      ]}>
        {title}
      </Text>
      <Text style={[
        styles.message, 
        { color: isDark ? colors.textLight : colors.textMedium }
      ]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});