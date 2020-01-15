import React, { useContext, useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import {
  backgroundColor,
  profilePlaceHolder,
  width
} from '../constants/constants';

import Button from '../components/Button';

import { CardContext } from '../context/CardContext';
import LoadingContext from '../context/LoadingContext';
import UserContext from '../context/UserContext';

import AsyncStorage from '@react-native-community/async-storage';

import { StackActions, NavigationActions } from 'react-navigation';

const ConfigScreen = ({ navigation }) => {
  // Context
  // const user = { _id: 'teste' };
  const [lastSync, setLastSync] = useState('Não realizado');
  const { setSync, logOff } = useContext(CardContext);
  const handleLoading = useContext(LoadingContext);
  const { data: user } = useContext(UserContext);

  const logoutAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login' })]
  });

  useEffect(() => {
    if (global.lastSync) {
      setLastSync(
        global.lastSync
          .toISOString()
          .split('T')[1]
          .split('.')[0]
      );
    }
  }, [global.lastSync]);

  const handleSync = async type => {
    handleLoading(true, 'Carregando...');
    // Fazendo ultima sincronia
    setSync(user._id, 'now');
    handleLoading(false, '');
    global.lastSync = new Date();
    setLastSync(
      new Date()
        .toISOString()
        .split('T')[1]
        .split('.')[0]
    );
    if (type === 'logoff') {
      // Parando o intervalo de sincronia
      setSync(user._id, 'stop');
      // Removendo usuário do armazenamento local
      await AsyncStorage.removeItem('userToken');
      // Voltando para tela de Login
      navigation.dispatch(logoutAction);
      logOff();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerData}>
        <View style={styles.containerPhoto}>
          <Image source={profilePlaceHolder} style={styles.photo} />
          <View style={styles.containerText}>
            <Text style={styles.textName}>{user.name}</Text>
            <Text style={styles.textEmail}>{user.email}</Text>
          </View>
        </View>
        <Button
          text="Sincronizar agora"
          callBack={() => handleSync()}
          style={styles.buttonSync}
        />
        <Text
          style={styles.textSync}
        >{`Ultima sincronização as: ${lastSync}`}</Text>
      </View>
      <Button
        text="Log-off"
        callBack={() => handleSync('logoff')}
        style={styles.buttonLogoff}
      />
    </View>
  );
};

ConfigScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor
  },
  containerData: {
    flex: 1,
    width
  },
  containerPhoto: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginLeft: 20
  },
  containerText: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10
  },
  buttonLogoff: {
    marginBottom: 20
  },
  buttonSync: {
    marginTop: 20,
    alignSelf: 'center'
  },
  textName: {
    fontSize: 16,
    color: 'white'
  },
  textEmail: {
    marginTop: 10,
    fontSize: 16,
    color: 'white'
  },
  textSync: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
    alignSelf: 'center'
  },
  photo: {
    marginTop: 10,
    width: width * 0.4,
    height: width * 0.4,
    borderWidth: 1,
    borderRadius: 100
  }
});

export default ConfigScreen;
