import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { useSecurityStore } from '@/store/useSecurityStore';
import { intruderService } from '@/services/intruder.service';
import { DEFAULT_PIN_LENGTH } from '@/utils/constants';

const NUM_PAD = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'backspace'],
];

export default function LockScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { verifyPin, incrementFailedAttempts, resetFailedAttempts, failedAttempts } = useAuthStore();
  const { intruderSettings } = useSecurityStore();

  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const shakeX = useSharedValue(0);
  const dotsScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const shake = () => {
    shakeX.value = withSequence(
      withTiming(-12, { duration: 60 }),
      withTiming(12, { duration: 60 }),
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
  };

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setPin(prev => prev.slice(0, -1));
      setErrorMessage('');
      return;
    }
    if (key === '') return;

    const newPin = pin + key;
    setPin(newPin);

    if (newPin.length === DEFAULT_PIN_LENGTH) {
      handleVerifyPin(newPin);
    }
  };

  const handleVerifyPin = async (enteredPin: string) => {
    setIsVerifying(true);
    try {
      const isValid = await verifyPin(enteredPin);
      if (isValid) {
        resetFailedAttempts();
        router.replace('/(tabs)');
      } else {
        const newCount = incrementFailedAttempts();
        shake();
        setPin('');
        setErrorMessage(`Incorrect PIN. ${newCount} failed attempt${newCount > 1 ? 's' : ''}.`);

        if (intruderSettings.enabled && newCount >= intruderSettings.sensitivity) {
          intruderService.handleFailedAttempt(newCount).catch(err => {
            console.error('Intruder detection error:', err);
          });
        }
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      setPin('');
    } finally {
      setIsVerifying(false);
    }
  };

  const dots = Array.from({ length: DEFAULT_PIN_LENGTH }, (_, i) => i);

  const getDotsColor = () => {
    if (errorMessage) return theme.colors.danger;
    return theme.colors.primary;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={56} color={theme.colors.primary} />
          <Text style={[styles.appName, { color: theme.colors.text, fontSize: theme.typography.h2, marginTop: theme.spacing.sm }]}>
            SecureGuard
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: 4 }]}>
            Enter your PIN to unlock
          </Text>
        </View>

        {/* Failed attempts indicator */}
        {failedAttempts > 0 && (
          <View
            style={[
              styles.warningBadge,
              {
                backgroundColor: `${theme.colors.danger}22`,
                borderRadius: theme.borderRadius.sm,
                paddingVertical: 6,
                paddingHorizontal: 12,
                marginTop: theme.spacing.md,
              },
            ]}
          >
            <Text style={{ color: theme.colors.danger, fontSize: theme.typography.small, fontWeight: '600' }}>
              ⚠️ {failedAttempts} failed attempt{failedAttempts > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* PIN Dots */}
        <Animated.View style={[styles.dotsRow, animatedStyle, { marginTop: theme.spacing.xl }]}>
          {dots.map(i => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  borderColor: getDotsColor(),
                  backgroundColor: i < pin.length ? getDotsColor() : 'transparent',
                },
              ]}
            />
          ))}
        </Animated.View>

        {errorMessage ? (
          <Text style={[styles.error, { color: theme.colors.danger, fontSize: theme.typography.small, marginTop: theme.spacing.sm }]}>
            {errorMessage}
          </Text>
        ) : null}

        {/* Number Pad */}
        <View style={[styles.numPad, { marginTop: theme.spacing.xl }]}>
          {NUM_PAD.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.numRow}>
              {row.map((key, colIndex) => (
                <TouchableOpacity
                  key={colIndex}
                  onPress={() => handleKeyPress(key)}
                  activeOpacity={0.7}
                  disabled={key === '' || isVerifying}
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

        {/* Biometric hint */}
        <TouchableOpacity style={[styles.biometricBtn, { marginTop: theme.spacing.lg }]}>
          <Ionicons name="finger-print" size={32} color={theme.colors.textSecondary} />
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.small, marginTop: 4 }}>
            Use Biometrics
          </Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Call */}
      <View style={[styles.emergencyContainer, { paddingBottom: 24 }]}>
        <TouchableOpacity style={styles.emergencyBtn}>
          <Ionicons name="call-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.small, marginLeft: 6 }}>
            Emergency Call
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  header: { alignItems: 'center' },
  appName: { fontWeight: '800' },
  subtitle: {},
  warningBadge: {},
  dotsRow: { flexDirection: 'row', gap: 16 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2 },
  error: { textAlign: 'center' },
  numPad: { width: '100%', alignItems: 'center' },
  numRow: { flexDirection: 'row', marginBottom: 16, gap: 24 },
  numKey: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  numText: { fontWeight: '500' },
  biometricBtn: { alignItems: 'center' },
  emergencyContainer: { alignItems: 'center' },
  emergencyBtn: { flexDirection: 'row', alignItems: 'center' },
});
