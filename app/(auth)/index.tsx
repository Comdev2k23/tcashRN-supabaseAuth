// app/(auth)/sign-in.tsx
import { supabase } from '@/lib/Auth'
import { Link, useRouter } from 'expo-router'
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

export default function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const insets = useSafeAreaInsets()
  const router = useRouter()

  async function signInWithEmail() {
    setLoading(true)
    setError(null)
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (signInError) {
        setError(signInError.message)
        Alert.alert('Sign In Error', signInError.message)
        return
      }
      
      // Successful sign-in - redirect to dashboard home
      console.log('Sign in successful, redirecting to dashboard...')
      router.replace('/(dashboard)/home')
      
    } catch (err) {
      console.error('Unexpected error during sign in:', err)
      setError('An unexpected error occurred')
      Alert.alert('Error', 'An unexpected error occurred during sign in')
    } finally {
      setLoading(false)
    }
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
              source={require('@/assets/images/signin.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
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
                onSubmitEditing={signInWithEmail}
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={signInWithEmail}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
              <Link href="/(auth)/sign-up" style={styles.signUpLink}>
                Sign Up
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