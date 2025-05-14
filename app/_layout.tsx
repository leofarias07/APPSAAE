import React, { useState, useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { LogBox } from 'react-native';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@/constants/colors';
import { checkReactNativeImports } from '@/utils/diagnostic';
import { AuthProvider } from '@/contexts/AuthContext';
import { ClientProvider } from '@/contexts/ClientContext';
import { SplashVideo } from './SplashVideo';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Ignore specific warnings
LogBox.ignoreLogs(['Overwriting fontFamily style attribute preprocessor']);

// Para garantir que todos os componentes do React Native estejam disponíveis globalmente
import 'react-native-gesture-handler';

export default function RootLayout() {
  useFrameworkReady();
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    // Executar verificação de importações no início da aplicação
    checkReactNativeImports();
  }, []);

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (showSplash) {
    return <SplashVideo onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
      <ClientProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <Stack 
            screenOptions={{
              headerShown: false,
              contentStyle: { 
                backgroundColor: isDark ? colors.darkBg : colors.lightBg
              },
            }} 
          >
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
            <Stack.Screen name="bill-details/[id]/[parcel]" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </ClientProvider>
    </AuthProvider>
  );
}