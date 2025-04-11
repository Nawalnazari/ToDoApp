import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { scaleHeight } from '@src/utils';
import { ActivityIndicator } from 'react-native-paper';


const LoginScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setError('');
      setIsLoading(true);

      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );

      if (userCredential.user) {
        console.log('Login successful:', userCredential.user.email);
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed');
      console.log('Login error:', err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineLarge">Login</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        disabled={isLoading}
      />
      <TextInput
        label="Password"
        value={password}
        secureTextEntry
        onChangeText={text => setPassword(text)}
        disabled={isLoading}
      />
      <Button 
        style={{ margin: 10 }} 
        mode="contained" 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size={20} />
        ) : (
          'Log in'
        )}
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  insideContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: { alignItems: 'center' },
  buttonContainer: { marginTop: 50 },
  errorText: {
    color: 'red',
    marginVertical: scaleHeight(10),
  },
});

export default LoginScreen;
