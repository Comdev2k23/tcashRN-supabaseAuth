import { useUser } from '@/lib/useUser';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function Cashin() {
  // State management
  const [formData, setFormData] = useState({
    type: 'cashin',
    refNumber: '',
    amount: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // User data
  const { user } = useUser();
  const userId = user?.id;

  // Handle form input changes
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Submit transaction
  const handleAddTransaction = async () => {
    if (!userId) return;

    // Basic validation
    if (!formData.refNumber.trim() || !formData.amount.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        `https://tcash-api.onrender.com/api/transactions/new-transaction/${userId}`,
        formData
      );
      Alert.alert('Success', 'Transaction saved ✅');
      // Reset form after successful submission
      setFormData({
        type: 'cashin',
        refNumber: '',
        amount: ''
      });
    } catch (error) {
      console.error("Error submitting transaction", error);
      Alert.alert('Error', 'Failed to save transaction. Please try again.');
    } finally {
      setIsLoading(false);
      router.push('/(dashboard)/home');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(auth)')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#5E936C" />
          </TouchableOpacity>
          <Text style={styles.title}>Cash-In Transaction</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.innerContainer}>
          <View style={styles.formContainer}>
            {/* Reference Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reference Number</Text>
              <TextInput
                placeholder="Enter or paste reference number"
                value={formData.refNumber}
                onChangeText={(text) => handleInputChange('refNumber', text)}
                style={styles.input}
                placeholderTextColor="#999"
                keyboardType="numeric"
                returnKeyType="next"
              />
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                placeholder="₱ 0.00"
                value={formData.amount}
                onChangeText={(text) => handleInputChange('amount', text)}
                style={styles.input}
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleAddTransaction}
              style={[styles.button, isLoading && styles.buttonDisabled]}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Processing...' : 'Submit Transaction'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8FFD7',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#E8FFD7',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5E936C',
    textAlign: 'center',
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#5E936C',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#5E936C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A0B8A5',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});