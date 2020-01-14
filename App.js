import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { pushNotifications } from './src/services';

import HomeScreen from './src/screens/HomeScreen';
import CardScreen from './src/screens/CardScreen';
import LoginScreen from './src/screens/LoginScreen';
import NewUserScreen from './src/screens/NewUserScreen';
import ConfigScreen from './src/screens/ConfigScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import RedefineScreen from './src/screens/RedefineScreen';

import { CardProvider } from './src/context/CardContext';
import { UserProvider } from './src/context/UserContext';
import { MessageProvider } from './src/context/MessageContext';
import { LoadingProvider } from './src/context/LoadingContext';

pushNotifications.configure();

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Card: CardScreen,
    Login: LoginScreen,
    NewUser: NewUserScreen,
    Conf: ConfigScreen,
    Welcome: WelcomeScreen,
    Forgot: ForgotPasswordScreen,
    Redefine: RedefineScreen
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e'
      },
      headerTitleStyle: {
        fontSize: 16
      }
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);
const App = () => {
  return (
    <MessageProvider>
      <LoadingProvider>
        <UserProvider>
          <CardProvider>
            <AppContainer />
          </CardProvider>
        </UserProvider>
      </LoadingProvider>
    </MessageProvider>
  );
};

export default App;
