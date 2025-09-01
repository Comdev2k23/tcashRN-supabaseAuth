// app/(dashboard)/home.tsx
import SignOutButton from '@/components/SignOutButton';
import { useUser } from '@/lib/useUser';
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Transaction = {
  id: number;
  refnumber: string;
  amount: number;
  created_at: string;
  type: string;
};

export default function HomeScreen() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.id;
  const username = user?.email?.split('@')[0] || 'User';

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  })();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString || 'No date';
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || 'No date';
    }
  };

  async function fetchData() {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const [balanceRes, transactionsRes] = await Promise.all([
        axios.get(`https://tcash-api.onrender.com/api/users/${userId}`),
        axios.get(`https://tcash-api.onrender.com/api/transactions/${userId}`)
      ]);
      
      // Add proper error handling for balance
      const userBalance = balanceRes.data?.user?.balance ?? 
                         balanceRes.data?.balance ?? 
                         0;
      
      setBalance(Number(userBalance) || 0);
      setTransactions(transactionsRes.data || []);
    } catch (error) {
      console.log("Error fetching data", error);
      // Set default values on error
      setBalance(0);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchData();
      }
    }, [userId])
  );

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  const renderTransactionItem = (item: Transaction) => {
    const isCashIn = item.type === 'cashin';
    const amountColor = isCashIn ? styles.cashInText : styles.cashOutText;
    const amountPrefix = isCashIn ? '-' : '+';

    return (
      <View key={item.id} style={styles.transactionItem}>
        <View style={styles.transactionHeader}>
          <Text style={styles.refNumber}>Ref: {item.refnumber}</Text>
          <Text style={[styles.amount, amountColor]}>
            ₱{amountPrefix}{Math.abs(Number(item.amount)).toFixed(2)}
          </Text>
        </View>
        <View style={styles.transactionFooter}>
          <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
          <Text style={[styles.typeText, amountColor]}>
            {isCashIn ? 'Cash In' : 'Cash Out'}
          </Text>
        </View>
      </View>
    );
  };

  if (userLoading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3E5F44" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Please sign in</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={require('@/assets/images/girl.png')}
            />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.username}>Hi, {username}!</Text>
            <Text style={styles.greeting}>Good {greeting}!</Text>
          </View>

          <View style={styles.signOutButtonContainer}>
            <SignOutButton variant="icon" size="small" />
          </View>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance:</Text>
          <Text style={styles.balanceAmount}>
            ₱ {typeof balance === 'number' ? balance.toFixed(2) : '0.00'}
          </Text>
        </View>

        {/* Cash In / Cash Out */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => router.push('/(dashboard)/(transaction)/cashin')}
            style={styles.actionButton}
          >
            <View style={styles.cashInIcon}>
              <BanknoteArrowUp size={24} color="#3E5F44" />
            </View>
            <Text style={styles.actionText}>Cash In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(dashboard)/(transaction)/cashout')}
            style={styles.actionButton}
          >
            <View style={styles.cashOutIcon}>
              <BanknoteArrowDown size={24} color="#3E5F44" />
            </View>
            <Text style={styles.actionText}>Cash Out</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions Section */}
        <View style={styles.transactionsCard}>
          <Text style={styles.transactionsTitle}>Recent transactions</Text>
          
          {recentTransactions.length === 0 ? (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyText}>No recent transactions</Text>
            </View>
          ) : (
            <View>
              {recentTransactions.map(renderTransactionItem)}
              <TouchableOpacity 
                onPress={() => router.push('/(dashboard)/transactions')}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>View All Transactions</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#E8FFD7',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#E8FFD7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    borderWidth: 2,
    borderColor: '#34D399',
    borderRadius: 50,
    padding: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  greeting: {
    fontSize: 14,
    color: '#10B981',
  },
  signOutButtonContainer: {
    backgroundColor: '#D1FAE5',
    padding: 8,
    borderRadius: 20,
  },
  balanceCard: {
    backgroundColor: 'white',
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 20,
    color: '#3E5F44',
    fontWeight: '500',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5E936C',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cashInIcon: {
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 30,
    marginBottom: 8,
  },
  cashOutIcon: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 30,
    marginBottom: 8,
  },
  actionText: {
    color: '#3E5F44',
    fontWeight: '600',
  },
  transactionsCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E5F44',
    marginBottom: 16,
  },
  transactionItem: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  refNumber: {
    color: '#3E5F44',
    fontWeight: '500',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cashInText: {
    color: '#EF4444',
  },
  cashOutText: {
    color: '#5E936C',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#5E936C',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#9CA3AF',
  },
  viewAllButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  viewAllText: {
    color: '#10B981',
    fontWeight: '500',
  },
});