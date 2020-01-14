import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FillField from '../components/FillField';
import CheckBox from '@react-native-community/checkbox';
import server from '../api/server';
import AsyncStorage from '@react-native-community/async-storage';

import LoadingContext from '../context/LoadingContext';
import MessageContext from '../context/MessageContext';

import UserContext from '../context/UserContext';

import { StackActions, NavigationActions } from 'react-navigation';

import {
  logo,
  logoStye,
  backgroundColor,
  textColor
} from '../constants/constants';

import Button from '../components/Button';
import TextButton from '../components/TextButton';

//TODO google e faccebook signup

const LoginScreen = ({ navigation }) => {
  // Context
  const handleLoading = useContext(LoadingContext);

  const { defineUser } = useContext(UserContext);

  const handleWarning = useContext(MessageContext);

  // Defining states
  const [rememberCheckValue, setRememberCheckValue] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  // Defining functions
  const rememberCheckToggle = () => {
    setRememberCheckValue(!rememberCheckValue);
  };

  const homeScreenDefault = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })]
  });

  const loginScreenDefault = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login' })]
  });

  const handleLogin = async token => {
    handleLoading(true, 'Carregando...');

    try {
      const response = await server.post('/users/login', {
        email,
        password,
        token
      });

      defineUser({ ...response.data.data.user, token: response.data.token });

      // Redefinindo senha
      if (
        response.data.message === 'Recuperando senha' ||
        response.data.message === 'Primeiro acesso'
      ) {
        handleLoading(false, '');
        // navigation.dispatch(homeScreenDefault);
        const paramToPass = { firstAccess: true };
        if (response.data.message === 'Primeiro acesso' && rememberCheckValue)
          return navigation.navigate('Redefine', {
            ...paramToPass,
            requestToken: true
          });
        navigation.navigate('Redefine', paramToPass);
      } else {
        // Seguindo para login normal
        if (!rememberCheckValue && !token) {
          console.log('removendo');
          await AsyncStorage.removeItem('userToken');
        }

        if (rememberCheckValue || token) {
          console.log('salvando token', response.data.token);
          await AsyncStorage.setItem(
            'userToken',
            JSON.stringify(response.data.token)
          );
        }
        handleLoading(false, '');
        navigation.dispatch(homeScreenDefault);
      }
    } catch (err) {
      handleLoading(false, '');
      handleWarning(true, err.response.data.message);
    }
  };
  //TODO enviar email para email real e não para mailtrap
  //TODO se não tiver conexão, entrar offline e quando voltar a internet, sincronizar
  //TODO editar dados do usuário
  // TODO usuário inativo, quando tentar voltar, enviar email de confirmação para alterar senha.
  const handleResetNextFocus = () => {
    setPasswordFocus(false);
    setEmailFocus(false);
  };

  // Receiveing data from NewUser
  const msg = navigation.getParam('msg', null);
  const refresh = navigation.getParam('date', null);

  useEffect(() => {
    if (msg) {
      setShowMessageWarning(true);
      setMessageWarning(msg);
    }
  }, [refresh]);

  // Verificar se existe lembrar de mim armazenou um usuário

  useEffect(() => {
    retrieveRememberUser();
  }, []);

  const retrieveRememberUser = async () => {
    try {
      console.log('aqui');
      const userPreParse = await AsyncStorage.getItem('userToken');
      const userToken = JSON.parse(userPreParse);
      console.log('aqui', userToken);
      if (!userToken) return;
      handleLogin(userToken);
    } catch (err) {
      return;
    }
  };
  // ----------------RENDER-------------------------
  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Image style={styles.logo} source={logo} />
      </View>
      <View style={styles.containerFields}>
        <FillField
          field="EMAIL"
          onChangeTextInput={val => setEmail(val)}
          setNext={() => {
            if (!password) setPasswordFocus(true);
            if (password) handleLogin();
          }}
          resetNextFocus={handleResetNextFocus}
          focus={emailFocus}
        />

        <FillField
          secure={true}
          marginTop={10}
          field="SENHA"
          onChangeTextInput={val => setPassword(val)}
          setNext={() => {
            if (!email) setEmailFocus(true);
            if (email) handleLogin();
          }}
          resetNextFocus={handleResetNextFocus}
          focus={passwordFocus}
        />
        <Button text="LOGIN" callBack={() => handleLogin()} />
        <View style={styles.containerRememberForgot}>
          <TouchableOpacity
            style={styles.containerRemember}
            onPress={rememberCheckToggle}
          >
            <CheckBox style={styles.checkBox} value={rememberCheckValue} />
            <Text style={styles.rememberText}>Lembre-se</Text>
          </TouchableOpacity>

          <TextButton
            text="Esqueci a Senha"
            callBack={() => {
              navigation.dispatch(loginScreenDefault);
              navigation.navigate('Forgot');
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.containerNewUser}
          onPress={() => {
            navigation.dispatch(loginScreenDefault);
            navigation.navigate('NewUser');
          }}
        >
          <Text style={styles.clickHereText}>
            Clique aqui para registrar um{' '}
          </Text>
          <Text style={styles.newUserText}>NOVO USUÁRIO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

LoginScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor
  },
  containerLogo: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerFields: {
    flex: 4,
    alignItems: 'center'
  },
  containerRememberForgot: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  containerRemember: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerNewUser: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20
  },
  logo: {
    width: logoStye.width,
    height: logoStye.height
  },
  newUserText: {
    color: 'yellow',
    fontWeight: 'bold'
  },
  rememberText: {
    color: textColor
  },
  clickHereText: {
    color: textColor
  },
  checkBox: {
    color: textColor
  }
});

export default LoginScreen;
