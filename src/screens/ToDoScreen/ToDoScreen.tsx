import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Checkbox, IconButton, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator } from 'react-native-paper';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const ToDoScreen = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUserEmail(currentUser?.email || '');
    setIsLoading(true);
    if (!currentUser?.email) return;

    const subscriber = firestore()
      .collection('users')
      .doc(currentUser?.email)
      .collection('todos')
      .onSnapshot(querySnapshot => {
        const todoList: TodoItem[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          todoList.push({
            id: doc.id,
            text: data.text,
            completed: data.completed,
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        });
        setTodos(todoList);
        setIsLoading(false);
      });

    return () => subscriber();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        setIsActionLoading(true);
        const currentUser = auth().currentUser;
        if (!currentUser?.email) return;

        await firestore()
          .collection('users')
          .doc(currentUser?.email)
          .collection('todos')
          .add({
            text: newTodo.trim(),
            completed: false,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        setNewTodo('');
      } catch (error) {
        console.error('Error adding todo:', error);
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser?.email) return;

      const todoRef = firestore()
        .collection('users')
        .doc(currentUser?.email)
        .collection('todos')
        .doc(id);

      const doc = await todoRef.get();
      if (doc.exists) {
        await todoRef.update({
          completed: !doc.data()?.completed,
        });
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser?.email) return;

      await firestore()
        .collection('users')
        .doc(currentUser?.email)
        .collection('todos')
        .doc(id)
        .delete();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderItem = ({ item }: { item: TodoItem }) => (
    <View style={styles.todoItemContainer}>
      <View style={styles.todoItemContent}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={item.completed ? 'checked' : 'unchecked'}
            onPress={() => toggleTodo(item.id)}
          />
        </View>

        <Text style={[styles.todoText, item.completed && styles.completedTodo]}>
          {item.text}
        </Text>
        <IconButton icon="delete" onPress={() => deleteTodo(item.id)} />
      </View>

      <Text style={styles.timestamp}>
        {item.createdAt.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        })}{' '}
        {item.createdAt
          .toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
          .toLowerCase()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          My Tasks
        </Text>
        <IconButton
          icon="logout"
          iconColor="black"
          size={20}
          onPress={handleLogout}
        />
      </View>
      <Text style={styles.email}>{userEmail}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add a new task"
          right={
            isActionLoading ? (
              <TextInput.Icon icon={() => <ActivityIndicator size={20} />} />
            ) : (
              <TextInput.Icon icon="plus" onPress={addTodo} />
            )
          }
          onSubmitEditing={addTodo}
          disabled={isActionLoading}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  titleContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  email: { marginBottom: 5, color: 'pink' },

  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  todoItemContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  todoItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoText: {
    flex: 1,
    marginLeft: 8,
  },
  checkboxContainer: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    height: 20,
    width: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ToDoScreen;
