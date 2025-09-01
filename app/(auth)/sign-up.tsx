import { supabase } from '@/lib/Auth'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const insets = useSafeAreaInsets()


  async function signUpWithEmail() {
    setLoading(true)
    setError(null)
    const {
      data: { session },
      error: signUpError,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (signUpError) {
      setError(signUpError.message)
      Alert.alert(signUpError.message)
    }
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={insets.top + 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Header with Logo */}
          <View style={styles.header}>
            <Image 
              source={require('@/assets/images/signup.png')} // Update with your actual image path
              style={styles.logo}
            />
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Sign to your account</Text>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError(null)}>
                <Text style={styles.errorClose}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="email@address.com"
                placeholderTextColor="#93DA97"
                autoCapitalize={'none'}
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor="#93DA97"
                autoCapitalize={'none'}
                returnKeyType="done"
                onSubmitEditing={signUpWithEmail}
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={signUpWithEmail}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Already have an account? </Text>
              <Link href="/(auth)" style={styles.signUpLink}>
                <Text>Sign in</Text>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#E8FFD7',
    justifyContent: 'center' as const,
    padding: 24,
  },
  header: {
    alignItems: 'center' as const,
    marginBottom: 32,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: '#3E5F44',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#3E5F44',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  errorText: {
    color: '#DC2626',
    flex: 1,
  },
  errorClose: {
    color: '#DC2626',
    fontWeight: 'bold' as const,
    marginLeft: 8,
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#5E936C',
    borderWidth: 1,
    borderColor: '#93DA97',
  },
  button: {
    backgroundColor: '#5E936C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  signUpContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    paddingTop: 16,
  },
  signUpText: {
    color: '#3E5F44',
    fontSize: 16,
  },
  signUpLink: {
    color: '#3E5F44',
    fontSize: 16,
    fontWeight: '600' as const,
  },
}