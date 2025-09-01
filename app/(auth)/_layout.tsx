import { supabase } from '@/lib/Auth';
import { Session } from '@supabase/supabase-js';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8FFD7' }}>
        <ActivityIndicator size="large" color="#3E5F44" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(dashboard)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}