import React from 'react';
import { 
  View, 
  StyleSheet, 
  ViewStyle, 
  useColorScheme,
  Pressable,
  Platform
} from 'react-native';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled' | 'glass' | 'gradient';
  contentPadding?: 'normal' | 'large' | 'small' | 'none';
}

export function Card({ 
  children, 
  style, 
  onPress,
  variant = 'default',
  contentPadding = 'normal'
}: CardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const getPaddingStyle = () => {
    switch (contentPadding) {
      case 'large':
        return styles.paddingLarge;
      case 'small':
        return styles.paddingSmall;
      case 'none':
        return styles.paddingNone;
      default:
        return styles.paddingNormal;
    }
  };
  
  const getCardStyle = () => {
    const baseStyle = [
      styles.card,
      isDark ? styles.cardDark : styles.cardLight,
      getPaddingStyle()
    ];
    
    switch (variant) {
      case 'elevated':
        return [...baseStyle, isDark ? styles.cardElevatedDark : styles.cardElevated];
      case 'outlined':
        return [...baseStyle, isDark ? styles.cardOutlinedDark : styles.cardOutlinedLight];
      case 'filled':
        return [...baseStyle, isDark ? styles.cardFilledDark : styles.cardFilledLight];
      case 'glass':
        return [...baseStyle, isDark ? styles.cardGlassDark : styles.cardGlassLight];
      case 'gradient':
        // For gradient, we'll apply minimal styling here and use LinearGradient
        return [...baseStyle, styles.cardGradient];
      default:
        return baseStyle;
    }
  };
  
  // Special case for gradient variant
  if (variant === 'gradient') {
    const WrapperComponent = onPress ? Pressable : View;
    const wrapperProps = onPress ? {
      onPress,
      style: ({pressed}: {pressed: boolean}) => [
        styles.cardBase,
        style,
        pressed && styles.cardPressed
      ],
      android_ripple: { color: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)' }
    } : {
      style: [styles.cardBase, style]
    };
    
    return (
      <WrapperComponent {...wrapperProps}>
        <LinearGradient
          colors={isDark 
            ? [colors.darkBgAlt, colors.darkElevated] 
            : [colors.white, colors.primaryUltraLight]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, getPaddingStyle()]}
        >
          {children}
        </LinearGradient>
      </WrapperComponent>
    );
  }
  
  if (onPress) {
    return (
      <Pressable 
        style={({pressed}) => [
          ...getCardStyle(), 
          style,
          pressed && styles.cardPressed
        ]}
        onPress={onPress}
        android_ripple={{ color: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)' }}
      >
        {children}
      </Pressable>
    );
  }
  
  return (
    <View style={[...getCardStyle(), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
  },
  paddingNormal: {
    padding: 20,
  },
  paddingLarge: {
    padding: 24,
  },
  paddingSmall: {
    padding: 14,
  },
  paddingNone: {
    padding: 0,
  },
  cardLight: {
    backgroundColor: colors.cardLight,
    ...(Platform.OS === 'ios' ? {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    } : {
      elevation: 3,
    }),
  },
  cardDark: {
    backgroundColor: colors.cardDark,
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
    } : {
      elevation: 5,
    }),
  },
  cardElevated: {
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'ios' ? {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
    } : {
      elevation: 6,
    }),
  },
  cardElevatedDark: {
    backgroundColor: colors.darkElevated,
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
    } : {
      elevation: 8,
    }),
  },
  cardOutlinedLight: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.divider,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardOutlinedDark: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.darkBorder,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardFilledLight: {
    backgroundColor: colors.surfaceVariant,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardFilledDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardGlassLight: {
    backgroundColor: colors.glassLight,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardGlassDark: {
    backgroundColor: colors.glassDark,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  cardGradient: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  }
});