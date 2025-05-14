import React from 'react';
import { View, Text, StyleSheet, useColorScheme, Image, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Droplet } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

type HomeHeaderProps = {
  clientName: string | undefined;
  clientAddress: string | undefined;
};

export function HomeHeader({ clientName, clientAddress }: HomeHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Obter apenas o primeiro nome
  const firstName = clientName?.split(' ')[0] || 'Olá';

  return (
    <View style={styles.headerWrapper}>
      <LinearGradient
        colors={isDark 
          ? [colors.primaryDark, '#114076'] 
          : ['#0077D9', colors.primary]}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 0.8 }}
        style={styles.headerContainer}
      >
        {/* Elementos decorativos */}
        <View style={[styles.decorativeCircle, styles.circle1]} />
        <View style={[styles.decorativeCircle, styles.circle2]} />
        
        <View style={styles.headerContent}>
          <View style={styles.greeting}>
            <Text style={styles.welcomeText}>Bem-vindo,</Text>
            <Text style={styles.nameText}>{firstName}</Text>
            
            {clientAddress && (
              <View style={styles.addressWrapper}>
                <Text style={styles.addressText} numberOfLines={1}>
                  {clientAddress}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Droplet size={28} color={colors.primary} strokeWidth={2.5} />
            </View>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.headerShadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  headerContainer: {
    paddingTop: 24,
    paddingBottom: 32,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
  },
  circle1: {
    width: 140,
    height: 140,
    top: -30,
    right: -30,
  },
  circle2: {
    width: 80,
    height: 80,
    bottom: -20,
    left: 30,
  },
  greeting: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  addressWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    maxWidth: '95%',
  },
  logoContainer: {
    marginLeft: 16,
  },
  logoBackground: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  headerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
}); 