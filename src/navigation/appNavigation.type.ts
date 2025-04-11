import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export enum Screen {
  FORCE_UPDATE_SCREEN = 'FORCE_UPDATE_SCREEN',
  NETWORK_CHECK = 'NETWORK_CHECK',
  NEWS_DETAIL = 'NEWS_DETAIL',
  START = 'Start',
  SETTING = 'SETTING',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  REGISTER = 'REGISTER',
  TODO = 'TODO',
}

export type NavStackParams = {
  [Screen.START]: undefined;
  [Screen.LOGIN]: undefined;
  [Screen.SIGNUP]: undefined;
  [Screen.REGISTER]: undefined;
  [Screen.TODO]: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<NavStackParams>;

