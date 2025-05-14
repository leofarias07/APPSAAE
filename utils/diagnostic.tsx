import { Text, View, Platform } from 'react-native';
import React from 'react';

export function checkReactNativeImports() {
  console.log('React Native Diagnostic Info:');
  console.log(`Platform: ${Platform.OS}`);
  console.log(`React available: ${typeof React !== 'undefined'}`);
  console.log(`React Native components available:`);
  console.log(`- Text: ${typeof Text !== 'undefined'}`);
  console.log(`- View: ${typeof View !== 'undefined'}`);
  
  try {
    // Verificar outros componentes dinamicamente
    const RN = require('react-native');
    console.log('React Native imports check:');
    
    const components = [
      'TouchableOpacity', 'StyleSheet', 'ActivityIndicator',
      'ScrollView', 'FlatList', 'Image', 'TextInput'
    ];
    
    components.forEach(comp => {
      console.log(`- ${comp}: ${typeof RN[comp] !== 'undefined'}`);
    });
  } catch (error) {
    console.error('Erro ao verificar componentes React Native:', error);
  }
} 