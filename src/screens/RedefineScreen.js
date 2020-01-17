import React, { useState, useContext } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView
} from 'react-native';
import FillField from '../components/FillField';
import {
  logo,
  logoStye,
  backgroundColor,
  textColor,
  imageURL
} from '../constants/constants';
import Button from '../components/Button';
import TextButton from '../components/TextButton';
import server from '../api/server';
import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import MessageContext from '../context/MessageContext';
import LoadingContext from '../context/LoadingContext';
import UserContext from '../context/UserContext';

// TODO quando aperto para enviar, deve tirar keyboard
// TODO keyboard arrastar para cima a tela e não ficar por cima

const RedefineScreen = ({ navigation }) => {
  const firstAccess = navigation.getParam('firstAccess');
  const requestToken = navigation.getParam('requestToken');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordFocus, setPasswordFocus] = useState('');
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState('');

  const { data: user, defineUser } = useContext(UserContext);
  const handleLoading = useContext(LoadingContext);
  const handleWarning = useContext(MessageContext);

  const handleResetNextFocus = () => {
    setPasswordFocus(false);
    setConfirmPasswordFocus(false);
  };

  const mainScreenDefault = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })]
  });

  const welcomeScreenDefault = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Welcome' })]
  });

  const handleSubmit = async () => {
    handleLoading(true, 'Carregando...');
    if (password !== confirmPassword) {
      handleLoading(false, '');
      return handleWarning(true, 'As senhas devem ser iguais', 'error');
    }
    try {
      const response = await server.patch('/users/redefinePassword', {
        password,
        confirmPassword,
        user
      });

      // Mostrando mensagem de retorno
      handleWarning(true, response, 'response');

      handleLoading(false, '');

      if (requestToken)
        await AsyncStorage.setItem(
          'userToken',
          JSON.stringify(response.data.token)
        );
      if (firstAccess) return navigation.dispatch(welcomeScreenDefault);
      navigation.dispatch(mainScreenDefault);
    } catch (err) {
      handleLoading(false, '');
      handleWarning(true, err, 'error');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.containerLogo}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.textTitle}>Redefinindo Senha</Text>
        <Text style={styles.text}>
          Redefina sua senha abaixo. Sempre utilize senhas fortes.
        </Text>
      </View>
      <View style={styles.containerEmail}>
        <FillField
          field="SENHA"
          type="password"
          onChangeTextInput={value => setPassword(value)}
          focus={passwordFocus}
          setNext={() => {
            if (!confirmPassword) setConfirmPasswordFocus(true);
            if (confirmPassword) handleSubmit();
          }}
          resetNextFocus={handleResetNextFocus}
        />
        <FillField
          marginTop={10}
          secure={true}
          field="CONFIRMAR SENHA"
          type="password"
          onChangeTextInput={value => setConfirmPassword(value)}
          focus={confirmPasswordFocus}
          setNext={() => {
            if (!password) setPasswordFocus(true);
            if (password) handleSubmit();
          }}
          resetNextFocus={handleResetNextFocus}
        />
        <Button text="ENVIAR" callBack={() => handleSubmit()} />
        <View style={styles.textButton}>
          <TextButton
            text="Login"
            callBack={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

RedefineScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor
  },
  containerEmail: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  textTitle: {
    fontSize: 20,
    marginTop: 50,
    color: textColor
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: 20,
    color: textColor
  },
  containerLogo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: logoStye.width,
    height: logoStye.height
  },
  textButton: {
    marginTop: 20
  }
});

export default RedefineScreen;
