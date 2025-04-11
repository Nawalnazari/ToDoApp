import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { scaleHeight } from '@src/utils';
import { ActivityIndicator } from 'react-native-paper';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (password == confirmPassword) {
      try {
        setError('');
        setIsLoading(true);
        const userCredential = await auth().createUserWithEmailAndPassword(
          email,
          password
        );

        if (userCredential.user) {
          console.log('Registration successful!');
        }
      } catch (err: any) {
        setError(err?.message || 'Registration failed');
        console.log(err?.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('password does not match');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineLarge">Sign Up</Text>
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
        onChangeText={text => setPassword(text)}
        secureTextEntry
        disabled={isLoading}
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={text => {
          setConfirmPassword(text);
          setError('');
        }}
        secureTextEntry
        disabled={isLoading}
      />
      <Button
        style={{ margin: 10 }}
        mode="contained"
        onPress={handleSubmit}
        disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="white" size={20} /> : 'Sign Up'}
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

export default RegisterScreen;
