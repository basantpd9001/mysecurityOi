import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { DEFAULT_PIN_LENGTH } from '@/utils/constants';

const NUM_PAD = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'backspace'],
];

export default function SetPinScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { setPin } = useAuthStore();

  const [pin, setPin_] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const shakeX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const shake = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  };

  const currentPin = isConfirming ? confirmPin : pin;
  const setCurrentPin = isConfirming ? setConfirmPin : setPin_;

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setCurrentPin(prev => prev.slice(0, -1));
      return;
    }
    if (key === '') return;

    const newPin = currentPin + key;
    setCurrentPin(newPin);

    if (newPin.length === DEFAULT_PIN_LENGTH) {
      handlePinComplete(newPin);
    }
  };

  const handlePinComplete = async (enteredPin: string) => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    if (enteredPin !== pin) {
      shake();
      Alert.alert('PIN Mismatch', 'The PINs you entered do not match. Please try again.');
      setConfirmPin('');
      setPin_('');
      setIsConfirming(false);
      return;
    }

    setIsLoading(true);
    try {
      await setPin(pin);
      router.push('/onboarding/emergency-contacts');
    } catch (error) {
      console.error('Error setting PIN:', error);
      Alert.alert('Error', 'Failed to save PIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const dots = Array.from({ length: DEFAULT_PIN_LENGTH }, (_, i) => i);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="lock-closed" size={48} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.typography.h2, marginTop: theme.spacing.md }]}>
            {isConfirming ? 'Confirm Your PIN' : 'Set Your Master PIN'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: theme.spacing.sm }]}>
            {isConfirming
              ? 'Enter the same PIN again to confirm'
              : 'This PIN protects all of SecureGuard'}
          </Text>
        </View>

        {/* PIN Dots */}
        <Animated.View style={[styles.dotsRow, animatedStyle]}>
          {dots.map(i => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  borderColor: theme.colors.primary,
                  backgroundColor:
                    i < currentPin.length ? theme.colors.primary : 'transparent',
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Number Pad */}
        <View style={[styles.numPad, { marginTop: theme.spacing.xl }]}>
          {NUM_PAD.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.numRow}>
              {row.map((key, colIndex) => (
                <TouchableOpacity
                  key={colIndex}
                  onPress={() => handleKeyPress(key)}
                  activeOpacity={0.7}
                  disabled={key === '' || isLoading}
                  style={[
                    styles.numKey,
                    {
                      backgroundColor: key === '' ? 'transparent' : theme.colors.card,
                      borderRadius: theme.borderRadius.full,
                      borderWidth: key === '' ? 0 : 1,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  {key === 'backspace' ? (
                    <Ionicons name="backspace-outline" size={24} color={theme.colors.text} />
                  ) : (
                    <Text style={[styles.numText, { color: theme.colors.text, fontSize: theme.typography.h3 }]}>
                      {key}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  header: { alignItems: 'center' },
  title: { fontWeight: '700', textAlign: 'center' },
  subtitle: { textAlign: 'center' },
  dotsRow: { flexDirection: 'row', marginTop: 32, gap: 16 },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  numPad: { width: '100%', alignItems: 'center' },
  numRow: { flexDirection: 'row', marginBottom: 16, gap: 24 },
  numKey: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: { fontWeight: '500' },
});
