import React, { useEffect, useState } from 'react';

import { NavigationContainerRef } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import {
  LoginScreen,
  RegisterScreen,
  StartScreen,
  ToDoScreen,
} from '@src/screens';

import { NavStackParams, Screen } from './appNavigation.type';
import auth from '@react-native-firebase/auth';

export const navigationRef =
  React.createRef<NavigationContainerRef<NavStackParams>>();

const Stack = createNativeStackNavigator<NavStackParams>();

const screenOptions: NativeStackNavigationOptions = {
  animation: 'slide_from_right',
  headerShown: false,
};

export const AppNavigation = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    console.log('user', user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    console.log('subscriber', subscriber);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!user ? (
        // Auth stack
        <>
          <Stack.Screen name={Screen.START} component={StartScreen} />
          <Stack.Screen name={Screen.LOGIN} component={LoginScreen} />
          <Stack.Screen name={Screen.REGISTER} component={RegisterScreen} />
        </>
      ) : (
        // App stack
        <>
          <Stack.Screen name={Screen.TODO} component={ToDoScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
