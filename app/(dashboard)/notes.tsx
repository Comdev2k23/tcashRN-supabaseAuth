import { useUser } from '@/lib/useUser';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Note {
  id: number;
  content: string;
  created_at: string;
}

export default function Notes() {
  const [formData, setFormData] = useState({
    content: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchNotes();
    }
  }, [userId]);

  const fetchNotes = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `https://tcash-api.onrender.com/api/notes/${userId}`
      );
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes", error);
      Alert.alert('Error', 'Failed to fetch notes. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (value: string) => {
    setFormData({ content: value });
  };

  const handleSaveNote = async () => {
    if (!userId) return;

    if (!formData.content.trim()) {
      Alert.alert('Error', 'Please enter your note');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        `https://tcash-api.onrender.com/api/notes/add-notes/${userId}`,
        { content: formData.content }
      );
      Alert.alert('Success', 'Note saved successfully');
      setFormData({ content: '' });
      fetchNotes(); // Refresh the notes list
    } catch (error) {
      console.error("Error saving note", error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  async function handleDelete(id: number) {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`https://tcash-api.onrender.com/api/notes/delete/${id}`);
              Alert.alert('Deleted', 'Note has been deleted.');
              fetchNotes();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note.');
              console.log('Delete error:', error);
            }
          },
        },
      ]
    );
  }

  const renderNoteItem = ({ item }: { item: Note }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteContent}>{item.content}</Text>
      <View style={styles.noteFooter}>
        <Text style={styles.noteDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={18} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(dashboard)/home')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#5E936C" />
          </TouchableOpacity>
          <Text style={styles.title}>Notes</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.innerContainer}>
          {/* Add Note Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Note</Text>
              <TextInput
                style={styles.input}
                value={formData.content}
                placeholder="Start typing your notes..."
                placeholderTextColor="#9CA3AF"
                onChangeText={handleInputChange}
                multiline={true}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              onPress={handleSaveNote}
              style={[styles.button, isLoading && styles.buttonDisabled]}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Saving...' : 'Save Note'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notes List */}
          <View style={styles.notesContainer}>
            <Text style={styles.sectionTitle}>My Notes</Text>
            {isFetching ? (
              <Text style={styles.loadingText}>Loading notes...</Text>
            ) : notes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color="#A0B8A5" />
                <Text style={styles.emptyText}>No notes yet</Text>
                <Text style={styles.emptySubtext}>Add your first note above</Text>
              </View>
            ) : (
              <FlatList
                data={notes}
                renderItem={renderNoteItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.notesList}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#5E936C',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
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
    marginBottom: 20,
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
    textAlignVertical: 'top',
    minHeight: 100,
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
  notesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5E936C',
    marginBottom: 15,
  },
  notesList: {
    gap: 15,
  },
  noteItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#5E936C',
  },
  noteContent: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 5,
  },
  loadingText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginVertical: 10,
  },
});