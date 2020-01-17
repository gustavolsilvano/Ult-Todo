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
import TextButton from '../components/TextButton';

import selectImage from '../function/handleSelectImage';
import createForm from '../function/createForm';

import server from '../api/server';
import { width, backgroundColor, textColor } from '../constants/constants';

import useKeyboardShow from '../hooks/useKeyboardShow';

import LoadingContext from '../context/LoadingContext';
import MessageContext from '../context/MessageContext';
import UserContext from '../context/UserContext';

// Defining global variables

const newUserScreen = ({ navigation }) => {
  // Context
  const handleLoading = useContext(LoadingContext);
  const handleWarning = useContext(MessageContext);
  const { data: user, defineUser } = useContext(UserContext);

  // Defining states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [photo, setPhoto] = useState(user.photo);
  const [imageToUpload, setImageToUpload] = useState(null);
  const [isTextShow, setIsTextShow] = useState(true);

  // Defining functions
  // TODO ajustar para so atualizer nome e email, sem precisar mexer na photo

  // Submitting account
  const updateAccount = async () => {
    handleLoading(true, 'Carregando...');
    try {
      const data = createForm(imageToUpload, name, email, user);
      const response = await server({
        method: 'post',
        url: '/users/updateMe',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        data: data
      });
      defineUser({ ...user, name, email, photo });
      handleLoading(false, '');
      handleWarning(true, response, 'response');
      navigation.navigate('Conf');
    } catch (err) {
      console.log('Erro ao atualizar conta', err);
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
            <Text style={styles.title}>Atualize seus dados abaixo.</Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.containerPhoto}
          onPress={() => selectImage(setPhoto, setImageToUpload)}
        >
          <Image source={{ uri: photo }} style={styles.photo} />
        </TouchableOpacity>
        <View style={styles.containerFields}>
          <FillField
            field="NOME"
            initialValue={name}
            onChangeTextInput={value => setName(value)}
            focus={nameFocus}
            setNext={() => {
              handleResetNextFocus();
              if (!email) setEmailFocus(true);
              if (email && name) updateAccount();
            }}
            resetNextFocus={handleResetNextFocus}
          />

          <FillField
            marginTop={20}
            initialValue={email}
            field="EMAIL"
            onChangeTextInput={value => setEmail(value)}
            focus={emailFocus}
            setNext={() => {
              handleResetNextFocus();
              if (!name) setNameFocus(true);
              if (email && name) updateAccount();
            }}
            resetNextFocus={handleResetNextFocus}
          />

          <Button text="ATUALIZAR" callBack={() => updateAccount()} />
          <TextButton
            style={{ marginTop: 10 }}
            text="Voltar"
            callBack={() => navigation.pop()}
          />
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
