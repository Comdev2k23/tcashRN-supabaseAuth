import { useUser } from '@/lib/useUser'
import axios from 'axios'
import { Trash2Icon } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

type Transaction = {
  id: number
  refnumber: string
  amount: number
  created_at: string
  type: string
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useUser()
  const userId = user?.id

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return dateString || 'No date'
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return dateString || 'No date'
    }
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://tcash-api.onrender.com/api/transactions/${userId}`
      )
      setTransactions(response.data)
      setFilteredTransactions(response.data)
    } catch (error) {
      console.log('Error Fetching Transactions', error)
      Alert.alert('Error', 'Failed to fetch transactions')
    }
  }

  useEffect(() => {
    if (userId) {
      setIsLoading(true)
      fetchData().finally(() => setIsLoading(false))
    }
  }, [userId])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTransactions(transactions)
    } else {
      const filtered = transactions.filter((transaction) =>
        transaction.refnumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTransactions(filtered)
    }
  }, [searchQuery, transactions])

  const handleDelete = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this transaction?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(
              `https://tcash-api.onrender.com/api/transactions/delete/${id}`
            )
            Alert.alert('Deleted', 'Transaction has been deleted.')
            fetchData()
          } catch (error) {
            Alert.alert('Error', 'Failed to delete transaction.')
            console.log('Delete error:', error)
          }
        },
      },
    ])
  }

  const renderItem = ({ item }: { item: Transaction }) => {
    const isCashIn = item.type === 'cashin'
    const amountColor = isCashIn ? '#F87171' : '#5E936C'
    const amountPrefix = isCashIn ? '-' : '+'

    return (
      <View
        style={{
          padding: 16,
          marginBottom: 8,
          backgroundColor: '#fff',
          borderRadius: 12,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          marginHorizontal: 16,
          borderWidth: 1,
          borderColor: '#F3F4F6',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ color: '#3E5F44', fontWeight: '500' }}>Ref:</Text>
          <Text style={{ color: '#3E5F44', fontWeight: '600' }}>{item.refnumber}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ color: '#3E5F44', fontWeight: '500' }}>Amount:</Text>
          <Text style={{ fontWeight: '700', color: amountColor }}>
            {amountPrefix}₱{Math.abs(Number(item.amount)).toFixed(2)}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: '#3E5F44', fontWeight: '500' }}>Date:</Text>
          <Text style={{ color: '#5E936C' }}>{formatDate(item.created_at)}</Text>
        </View>

        <View
          style={{
            marginTop: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              color: isCashIn ? '#F87171' : '#5E936C',
            }}
          >
            {isCashIn ? 'Cash In' : 'Cash Out'}
          </Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Trash2Icon color={'#3E5F44'} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#E8FFD7',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ fontSize: 18, color: '#4B5563', marginTop: 16 }}>
          Loading transactions...
        </Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#E8FFD7' }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={{ padding: 16, shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#3E5F44', marginBottom: 8 }}>
          Transactions
        </Text>

        <View>
          <TextInput
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 40,
              color: '#1F2937',
              borderWidth: 1,
              borderColor: '#93DA97',
            }}
            placeholder="Search by reference number..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            keyboardType="numeric"
            returnKeyType="search"
          />
          <View style={{ position: 'absolute', left: 12, top: 12 }}>
            <Text style={{ color: '#9CA3AF' }}>🔍</Text>
          </View>
        </View>
      </View>

      {filteredTransactions.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {searchQuery ? (
            <Text style={{ color: '#6B7280' }}>Transaction not yet claimed</Text>
          ) : (
            <Text style={{ color: '#6B7280' }}>No transactions found</Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true)
            await fetchData()
            setRefreshing(false)
          }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListFooterComponent={() => <View style={{ height: 32 }} />}
          contentContainerStyle={{ paddingVertical: 16 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </KeyboardAvoidingView>
  )
}
