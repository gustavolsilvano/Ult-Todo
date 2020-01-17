import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import FillField from '../components/FillField';
import Button from '../components/Button';

import server from '../api/server';
import {
  width,
  backgroundColor,
  textColor,
  profilePlaceHolder
} from '../constants/constants';

import useKeyboardShow from '../hooks/useKeyboardShow';

import selectImage from '../function/handleSelectImage';
import createForm from '../function/createForm';

import LoadingContext from '../context/LoadingContext';
import MessageContext from '../context/MessageContext';

// Defining global variables

const newUserScreen = ({ navigation }) => {
  // Context
  const handleLoading = useContext(LoadingContext);
  const handleWarning = useContext(MessageContext);

  // Defining states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [imageToUpload, setImageToUpload] = useState(null);
  const [isTextShow, setIsTextShow] = useState(true);

  // Defining functions

  // TODO x para exlucir foto
  //TODO se estiver digitando e apertar para procurar imagem, o layout não volta para baixo, keyboard fica como se estivesse ainda
  // Submitting account
  const submitAccount = async () => {
    handleLoading(true, 'Carregando...');
    try {
      const data = createForm(imageToUpload, name, email);
      const response = await server({
        method: 'post',
        url: '/users/signUp',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        data: data
      });
      handleLoading(false, '');
      handleWarning(true, response, 'response');
      navigation.navigate('Login');
    } catch (err) {
      console.log('Erro ao criar conta', err);
      handleLoading(false, '');
      handleWarning(true, err, 'error');
    }
  };

  const handleResetNextFocus = () => {
    setNameFocus(false);
    setEmailFocus(false);
  };

  const showKeyboard = () => {
    setIsTextShow(false);
  };

  const hideKeayboard = () => {
    setIsTextShow(true);
  };

  useKeyboardShow(showKeyboard, hideKeayboard);

  return (
    <>
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.containerTitle}>
          {isTextShow ? (
            <Text style={styles.title}>
              Crie sua nova conta e faça parte do Ultimate ToDo App!
            </Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.containerPhoto}
          onPress={() => selectImage(setPhoto, setImageToUpload)}
        >
          <Image
            source={photo ? { uri: photo } : profilePlaceHolder}
            style={styles.photo}
          />
        </TouchableOpacity>
        <View style={styles.containerFields}>
          <FillField
            field="NOME"
            onChangeTextInput={value => setName(value)}
            focus={nameFocus}
            setNext={() => {
              handleResetNextFocus();
              if (!email) setEmailFocus(true);
              if (email && name) submitAccount();
            }}
            resetNextFocus={handleResetNextFocus}
          />

          <FillField
            marginTop={20}
            field="EMAIL"
            onChangeTextInput={value => setEmail(value)}
            focus={emailFocus}
            setNext={() => {
              handleResetNextFocus();
              if (!name) setNameFocus(true);
              if (email && name) submitAccount();
            }}
            resetNextFocus={handleResetNextFocus}
          />

          <Button text="CADASTRAR" callBack={() => submitAccount()} />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

newUserScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor
  },
  containerTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: textColor,
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  containerPhoto: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerFields: {
    flex: 3,
    marginTop: 10,
    alignItems: 'center'
  },
  submitButton: {
    borderWidth: 1,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: 'blue',
    borderRadius: 6,
    height: 50
  },
  submitText: {
    padding: 2,
    fontSize: 20
  },
  photo: {
    marginTop: 10,
    width: width * 0.5,
    height: width * 0.5,
    borderWidth: 1,
    borderRadius: width
  }
});

export default newUserScreen;
