import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Animated } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { colors } from '@/constants/colors';
import { Droplet } from 'lucide-react-native';

interface SplashVideoProps {
  onFinish: () => void;
}

export function SplashVideo({ onFinish }: SplashVideoProps) {
  const video = useRef(null);
  const { width, height } = Dimensions.get('window');
  const [isBuffering, setIsBuffering] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={{ width, height, position: 'absolute' }}
        source={require('../assets/splash.mp4')}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
          if (status.isLoaded) {
            if (isBuffering && status.isPlaying) {
              setIsBuffering(false);
            }
            if (status.didJustFinish) {
              onFinish();
            }
          }
        }}
        useNativeControls={false}
        isMuted={false}
      />
      <View style={styles.overlay}>
        <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
          <Droplet size={80} color={colors.white} style={styles.dropletIcon} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 69, 112, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropletIcon: {
    marginBottom: 20,
  }
});

export default SplashVideo; 