import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '@/config/ThemeProvider';
import { useSecurityStore } from '@/store/useSecurityStore';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { EmergencyContact } from '@/types';
import { smsService } from '@/services/sms.service';
import { MAX_EMERGENCY_CONTACTS } from '@/utils/constants';

export default function EmergencyContactsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { emergencyContacts, addContact, removeContact } = useSecurityStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [sending, setSending] = useState<string | null>(null);

  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Missing Info', 'Please enter name and phone number.');
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
      Alert.alert('Limit Reached', `Maximum ${MAX_EMERGENCY_CONTACTS} contacts allowed.`);
      return;
    }
    setName('');
    setPhone('');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Remove Contact', 'Remove this emergency contact?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeContact(id) },
    ]);
  };

  const handleTestSMS = async (contact: EmergencyContact) => {
    setSending(contact.id);
    try {
      const sent = await smsService.sendTestSMS(contact);
      Alert.alert(sent ? 'SMS Sent!' : 'SMS Failed', sent ? `Test message sent to ${contact.name}` : 'Could not send SMS. Check permissions.');
    } catch (error) {
      console.error('Test SMS error:', error);
    } finally {
      setSending(null);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Emergency Contacts" showBackButton onBack={() => router.back()} />

      <View style={[styles.content, { paddingHorizontal: theme.spacing.md }]}>
        {/* Add Form */}
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
                marginTop: theme.spacing.md,
              },
            ]}
          >
            <Text style={{ color: theme.colors.text, fontWeight: '700', fontSize: theme.typography.body, marginBottom: theme.spacing.sm }}>
              Add Contact ({emergencyContacts.length}/{MAX_EMERGENCY_CONTACTS})
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
              placeholderTextColor={theme.colors.textSecondary}
              style={[
                styles.input,
                {
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.sm,
                  backgroundColor: theme.colors.surface,
                  fontSize: theme.typography.body,
                  padding: theme.spacing.sm,
                  marginBottom: theme.spacing.sm,
                },
              ]}
            />
            <View style={styles.phoneRow}>
              <TextInput
                value={countryCode}
                onChangeText={setCountryCode}
                style={[
                  styles.codeInput,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    borderRadius: theme.borderRadius.sm,
                    backgroundColor: theme.colors.surface,
                    fontSize: theme.typography.body,
                    padding: theme.spacing.sm,
                    textAlign: 'center',
                    width: 64,
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
                    backgroundColor: theme.colors.surface,
                    fontSize: theme.typography.body,
                    padding: theme.spacing.sm,
                    flex: 1,
                    marginLeft: theme.spacing.sm,
                  },
                ]}
              />
            </View>
            <Button title="Add Contact" onPress={handleAdd} style={{ marginTop: theme.spacing.md }} fullWidth />
          </View>
        )}

        {/* Contacts List */}
        <FlatList
          data={emergencyContacts}
          keyExtractor={item => item.id}
          style={{ marginTop: theme.spacing.md }}
          ListEmptyComponent={
            <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: 32 }}>
              No emergency contacts added yet
            </Text>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.contactCard,
                {
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: theme.spacing.md,
                  marginBottom: theme.spacing.sm,
                },
              ]}
            >
              <View style={styles.contactRow}>
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: `${theme.colors.primary}22`,
                      borderRadius: theme.borderRadius.full,
                      width: 44,
                      height: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
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
                <TouchableOpacity
                  onPress={() => handleTestSMS(item)}
                  disabled={sending === item.id}
                  style={{ marginRight: 8 }}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={20}
                    color={sending === item.id ? theme.colors.textSecondary : theme.colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  form: {},
  input: { borderWidth: 1 },
  phoneRow: { flexDirection: 'row' },
  codeInput: { borderWidth: 1 },
  phoneInput: { borderWidth: 1 },
  contactCard: {},
  contactRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {},
});
