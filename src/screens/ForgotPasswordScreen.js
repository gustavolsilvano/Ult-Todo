import React, { useState, useContext } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native';
import server from '../api/server';
import {
  logo,
  logoStye,
  backgroundColor,
  textColor
} from '../constants/constants';

import FillField from '../components/FillField';
import Button from '../components/Button';
import TextButton from '../components/TextButton';

import MessageContext from '../context/MessageContext';
import LoadingContext from '../context/LoadingContext';

const ForgotPasswordScreen = ({ navigation }) => {
  const handleWarning = useContext(MessageContext);
  const handleLoading = useContext(LoadingContext);

  const [email, setEmail] = useState('');
  const handleSubmitForgot = async () => {
    handleLoading(true, 'Carregando...');

    try {
      const response = await server.post('/users/forgotPassword', {
        email
      });
      handleLoading(false, '');
      handleWarning(true, response, 'response');
      navigation.navigate('Login');
    } catch (err) {
      handleLoading(false, '');
      handleWarning(true, err, 'error');
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={styles.containerLogo}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.textTitle}>Esqueceu sua senha?</Text>
            <Text style={styles.text}>
              Um email com senha provisória será enviado para você. Preencha o
              campo abaixo com seu email.
            </Text>
          </View>
          <View style={styles.containerEmail}>
            <FillField
              field="EMAIL"
              type="email"
              onChangeTextInput={value => setEmail(value)}
              setNext={() => handleSubmitForgot()}
            />

            <Button text="ENVIAR" callBack={() => handleSubmitForgot()} />
            <View style={styles.textButton}>
              <TextButton
                text="Login"
                callBack={() => navigation.navigate('Login')}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

ForgotPasswordScreen.navigationOptions = {
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

export default ForgotPasswordScreen;
