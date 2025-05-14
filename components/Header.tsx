import React from 'react';
import { View, Text, StyleSheet, useColorScheme, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { Droplet as DropletIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  title: string;
  showLogo?: boolean;
}

export function Header({ title, showLogo = true }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <LinearGradient 
      colors={isDark ? [colors.darkBg, colors.darkBgAlt] : [colors.primaryUltraLight, colors.white]} 
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={[
        styles.container, 
        { 
          paddingTop: insets.top + 10,
        }
      ]}
    >
      {showLogo && (
        <View style={styles.logoContainer}>
          <DropletIcon 
            size={26} 
            color={isDark ? colors.primaryLight : colors.primary}
            style={styles.logoIcon}
          />
          <Text style={[
            styles.logoText, 
            { color: isDark ? colors.textLight : colors.primary }
          ]}>
            SAAE CAXIAS
          </Text>
        </View>
      )}
      <Text style={[
        styles.title, 
        { color: isDark ? colors.textLight : colors.textDark }
      ]}>
        {title}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoIcon: {
    marginRight: 10,
  },
  logoText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 25,
    letterSpacing: 0.25,
  },
});