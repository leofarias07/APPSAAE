import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  useColorScheme,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost' | 'accent';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Lógica para definir a cor e outros estilos com base na variante
  const getButtonStyle = (): ViewStyle[] => {
    const buttonStyles: ViewStyle[] = [
      styles.button,
      styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`],
      fullWidth && { width: '100%' },
    ];

    if (variant === 'primary') {
      buttonStyles.push(styles.buttonPrimary);
    } else if (variant === 'secondary') {
      buttonStyles.push(styles.buttonSecondary);
    } else if (variant === 'outlined') {
      buttonStyles.push(isDark ? styles.buttonOutlinedDark : styles.buttonOutlinedLight);
    } else if (variant === 'ghost') {
      buttonStyles.push(isDark ? styles.buttonGhostDark : styles.buttonGhostLight);
    } else if (variant === 'accent') {
      buttonStyles.push(styles.buttonAccent);
    }

    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
    }

    return buttonStyles;
  };

  // Lógica para definir o estilo do texto com base na variante
  const getTextStyle = (): TextStyle[] => {
    const textStyles: TextStyle[] = [
      styles.buttonText,
      styles[`buttonText${size.charAt(0).toUpperCase() + size.slice(1)}`],
    ];

    if (variant === 'primary') {
      textStyles.push(styles.textPrimary);
    } else if (variant === 'secondary') {
      textStyles.push(styles.textSecondary);
    } else if (variant === 'outlined') {
      textStyles.push(isDark ? styles.textOutlinedDark : styles.textOutlinedLight);
    } else if (variant === 'ghost') {
      textStyles.push(isDark ? styles.textGhostDark : styles.textGhostLight);
    } else if (variant === 'accent') {
      textStyles.push(styles.textAccent);
    }

    if (disabled) {
      textStyles.push(styles.textDisabled);
    }

    return textStyles;
  };

  // Renderizar um botão com gradiente para a variante primária
  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        onPress={loading ? undefined : onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={[{ alignSelf: fullWidth ? 'stretch' : 'flex-start' }, style]}
        {...rest}
      >
        <LinearGradient
          colors={colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[...getButtonStyle(), { opacity: loading ? 0.9 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.buttonContent}>
              {startIcon && <View style={styles.startIcon}>{startIcon}</View>}
              <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
              {endIcon && <View style={styles.endIcon}>{endIcon}</View>}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Renderizar um botão com gradiente para a variante accent
  if (variant === 'accent' && !disabled) {
    return (
      <TouchableOpacity
        onPress={loading ? undefined : onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={[{ alignSelf: fullWidth ? 'stretch' : 'flex-start' }, style]}
        {...rest}
      >
        <LinearGradient
          colors={colors.gradientWarning}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[...getButtonStyle(), { opacity: loading ? 0.9 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.buttonContent}>
              {startIcon && <View style={styles.startIcon}>{startIcon}</View>}
              <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
              {endIcon && <View style={styles.endIcon}>{endIcon}</View>}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Renderizar botão padrão para outras variantes
  return (
    <TouchableOpacity
      onPress={loading ? undefined : onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[...getButtonStyle(), { alignSelf: fullWidth ? 'stretch' : 'flex-start' }, style]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={
          variant === 'outlined' || variant === 'ghost' 
            ? colors.primary 
            : 'white'
        } />
      ) : (
        <View style={styles.buttonContent}>
          {startIcon && <View style={styles.startIcon}>{startIcon}</View>}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
          {endIcon && <View style={styles.endIcon}>{endIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  buttonMedium: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.primaryLight,
  },
  buttonOutlinedLight: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowOpacity: 0.08,
  },
  buttonOutlinedDark: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    shadowOpacity: 0.1,
  },
  buttonGhostLight: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonGhostDark: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonAccent: {
    backgroundColor: colors.accent,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.05,
    elevation: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    letterSpacing: 0.25,
  },
  buttonTextSmall: {
    fontSize: 13,
  },
  buttonTextMedium: {
    fontSize: 15,
  },
  buttonTextLarge: {
    fontSize: 17,
  },
  textPrimary: {
    color: 'white',
  },
  textSecondary: {
    color: 'white',
  },
  textOutlinedLight: {
    color: colors.primary,
  },
  textOutlinedDark: {
    color: colors.primaryLight,
  },
  textGhostLight: {
    color: colors.primary,
  },
  textGhostDark: {
    color: colors.primaryLight,
  },
  textAccent: {
    color: 'white',
  },
  textDisabled: {
    opacity: 0.8,
  },
  startIcon: {
    marginRight: 8,
  },
  endIcon: {
    marginLeft: 8,
  },
});