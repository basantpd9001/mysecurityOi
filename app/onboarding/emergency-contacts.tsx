import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '@/config/ThemeProvider';
import { useSecurityStore } from '@/store/useSecurityStore';
import { Button } from '@/components/ui/Button';
import { EmergencyContact } from '@/types';
import { MAX_EMERGENCY_CONTACTS } from '@/utils/constants';

export default function EmergencyContactsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { emergencyContacts, addContact, removeContact } = useSecurityStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  const handleAddContact = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Missing Info', 'Please enter both name and phone number.');
      return;
    }
    if (phone.length < 7 || phone.length > 15) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number.');
      return;
    }

    const contact: EmergencyContact = {
      id: uuidv4(),
      name: name.trim(),
      phoneNumber: phone.trim(),
      countryCode,
      createdAt: new Date(),
    };

    const added = addContact(contact);
    if (!added) {
      Alert.alert(
        'Limit Reached',
        `You can only add up to ${MAX_EMERGENCY_CONTACTS} emergency contacts.`,
      );
      return;
    }

    setName('');
    setPhone('');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Remove Contact', 'Are you sure you want to remove this contact?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeContact(id) },
    ]);
  };

  const handleContinue = () => {
    router.push('/onboarding/permissions');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="people" size={48} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.typography.h2, marginTop: theme.spacing.md }]}>
            Emergency Contacts
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: theme.spacing.sm }]}>
            These contacts will receive alerts when an intruder is detected
          </Text>
        </View>

        {/* Add Contact Form */}
        {emergencyContacts.length < MAX_EMERGENCY_CONTACTS && (
          <View
            style={[
              styles.form,
              {
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: theme.spacing.md,
                marginTop: theme.spacing.lg,
              },
            ]}
          >
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Contact Name"
              placeholderTextColor={theme.colors.textSecondary}
              style={[
                styles.input,
                {
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.sm,
                  fontSize: theme.typography.body,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  backgroundColor: theme.colors.surface,
                  marginBottom: theme.spacing.sm,
                },
              ]}
            />
            <View style={styles.phoneRow}>
              <TextInput
                value={countryCode}
                onChangeText={setCountryCode}
                style={[
                  styles.countryCode,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    borderRadius: theme.borderRadius.sm,
                    fontSize: theme.typography.body,
                    paddingHorizontal: theme.spacing.sm,
                    paddingVertical: theme.spacing.sm,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone Number"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="phone-pad"
                style={[
                  styles.phoneInput,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    borderRadius: theme.borderRadius.sm,
                    fontSize: theme.typography.body,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                    backgroundColor: theme.colors.surface,
                    flex: 1,
                    marginLeft: theme.spacing.sm,
                  },
                ]}
              />
            </View>
            <Button
              title="Add Contact"
              onPress={handleAddContact}
              style={{ marginTop: theme.spacing.md }}
              fullWidth
            />
          </View>
        )}

        {/* Contacts List */}
        <FlatList
          data={emergencyContacts}
          keyExtractor={item => item.id}
          style={{ marginTop: theme.spacing.md }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.contactItem,
                {
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: theme.spacing.md,
                  marginBottom: theme.spacing.sm,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}
            >
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: `${theme.colors.primary}22`,
                    borderRadius: theme.borderRadius.full,
                  },
                ]}
              >
                <Text style={{ color: theme.colors.primary, fontWeight: '700', fontSize: 18 }}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: theme.colors.text, fontWeight: '600', fontSize: theme.typography.body }}>
                  {item.name}
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption }}>
                  {item.countryCode} {item.phoneNumber}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', marginVertical: 16 }}>
              No contacts added yet
            </Text>
          }
        />
      </View>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingHorizontal: 24, paddingBottom: 24 }]}>
        <Button title="Continue" onPress={handleContinue} fullWidth />
        <TouchableOpacity onPress={handleContinue} style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption }}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  header: { alignItems: 'center' },
  title: { fontWeight: '700', textAlign: 'center' },
  subtitle: { textAlign: 'center' },
  form: {},
  input: { borderWidth: 1 },
  phoneRow: { flexDirection: 'row' },
  countryCode: { borderWidth: 1, width: 64, textAlign: 'center' },
  phoneInput: { borderWidth: 1 },
  contactItem: {},
  avatar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  bottomActions: {},
});
