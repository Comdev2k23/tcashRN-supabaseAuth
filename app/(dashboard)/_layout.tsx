// app/(dashboard)/_layout.tsx
import { supabase } from '@/lib/Auth';
import { Session } from '@supabase/supabase-js';
import { Redirect, Tabs } from 'expo-router';
import { CircleUserRound, FileClock, House, NotebookPen } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function DashboardLayout() {
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

  if (!session) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs screenOptions={{
      headerShown: false, 
      tabBarActiveTintColor: '#3E5F44',
      tabBarStyle: {
        backgroundColor: '#E8FFD7',
        borderTopWidth: 0,
        borderTopColor: 'transparent',
        elevation: 0,
      }
    }}>
      <Tabs.Screen 
        name="home" 
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House size={28} color={color} />,
        }}
      />

      <Tabs.Screen 
        name="transactions" 
        options={{
          title: "Transactions",
          tabBarIcon: ({ color }) => <FileClock size={28} color={color} />,
        }}
      />

      <Tabs.Screen 
        name="notes" 
        options={{
          title: "Notes",
          tabBarIcon: ({ color }) => <NotebookPen size={28} color={color} />,
        }}
      />

      <Tabs.Screen 
        name="profile" 
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <CircleUserRound size={28} color={color} />,
        }}
      />

      {/* Hide transaction detail screens from tabs */}
      <Tabs.Screen 
        name="(transaction)" 
        options={{
          href: null
        }}
      />
    </Tabs>
  );
}