
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { supabase } from '@/lib/Auth';

export default function Auth() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(text: string) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
      />

      <TextInput
        onChangeText={(text: string) => setPassword(text)}
        value={password}
        secureTextEntry
        placeholder="Password"
        autoCapitalize="none"
      />

      <Button
        title="Sign in"
        disabled={loading}

        onPress={signInWithEmail}
      />
      <Button
        title="Sign up"
        disabled={loading}
        onPress={signUpWithEmail}
      />

      <Text className='text-2xl'>HEllo World</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, padding: 12 },
});
