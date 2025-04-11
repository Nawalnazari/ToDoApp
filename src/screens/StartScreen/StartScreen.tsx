import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from 'react-native-paper';
import { NavStackParams, Screen } from '../../navigation/appNavigation.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type NavigationProp = NativeStackNavigationProp<NavStackParams>;
const StartScreen = () => {
  // const { color, navigation } = useAppContext();
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  useEffect(() => {
    const getName = async () => {
      console.log('hi nawal');
      const user = await firestore()
        .collection('users')
        .doc('be6QJ9qQAFR4G6ClAsII')
        .get();
      console.log(user);
      const userName = user.data();
      console.log(userName?.name);
      setName(userName?.name);
    };

    getName();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.insideContainer}>
        <View style={styles.textContainer}>
          <Text variant="headlineLarge">Welcome to To Do App</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            style={{ margin: 10 }}
            mode="contained"
            onPress={() => navigation.navigate(Screen.LOGIN)}>
            Login
          </Button>
          <Button
            style={{ margin: 10 }}
            mode="contained"
            onPress={() => navigation.navigate(Screen.REGISTER)}>
            Sign Up
          </Button>
        </View>
      </View>
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
});

export default React.memo(StartScreen);
