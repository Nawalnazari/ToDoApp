import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';

import { LocalizationProvider } from './context';
import { AppNavigation, navigationRef } from './navigation/AppNavigation';
import store, { persistor } from './store';
import { loader } from './utils';

export const MainApp = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <LocalizationProvider>
          <NavigationContainer ref={navigationRef}>
            {/**
             * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
             * and saved to redux.
             * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
             * for example `loading={<SplashScreen />}`.
             * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
             */}
            <PersistGate loading={null} persistor={persistor}>
              <AppNavigation />
              {/* <IndicatorView isLoading={false} ref={loader} /> */}
            </PersistGate>
          </NavigationContainer>
        </LocalizationProvider>
      </PaperProvider>
    </Provider>
  );
};
