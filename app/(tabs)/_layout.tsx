import { Tabs } from 'expo-router';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Receipt, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  const isDark = colorScheme === 'dark';
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: isDark ? 'rgba(0, 40, 60, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 93, 147, 0.1)',
        },
        tabBarActiveTintColor: isDark ? colors.primaryLighter : colors.primary,
        tabBarInactiveTintColor: isDark ? colors.textMuted : colors.textMedium,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarItemStyle: styles.tabBarItem,
        tabBarBackground: () => (
          <BlurView
            tint={isDark ? 'dark' : 'light'}
            intensity={60}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Home size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: 'Faturas',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Receipt size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <User size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          )
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 1,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    paddingBottom: 4,
  },
  tabBarIcon: {
    marginTop: 5,
  },
  tabBarItem: {
    paddingTop: 6,
  },
  iconContainer: {
    padding: 6,
    borderRadius: 10,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(0, 93, 147, 0.12)',
  },
});