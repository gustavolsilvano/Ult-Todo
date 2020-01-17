import React, { useContext, useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { backgroundColor, width } from '../constants/constants';
import server from '../api/server';

import Button from '../components/Button';

import { CardContext } from '../context/CardContext';
import LoadingContext from '../context/LoadingContext';
import UserContext from '../context/UserContext';

import AsyncStorage from '@react-native-community/async-storage';

import { StackActions, NavigationActions } from 'react-navigation';

const ConfigScreen = ({ navigation }) => {
  // Context
  // const user = { _id: 'teste' };
  const [photo, setPhoto] = useState(null);
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
  // TODO editar dados do perfil
  // Iniciando tela
  const getProfilePhoto = async () => {
    let profile;
    try {
      profile = await server.get(user.photo);
    } catch (err) {
      console.log('erro carregando foto', err);
    }
    setPhoto(profile.config.url);
  };

  useEffect(() => {
    getProfilePhoto();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerData}>
        <View style={styles.containerPhoto}>
          <Image source={{ uri: photo }} style={styles.photo} />
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

// {"config": {"adapter": [Function xhrAdapter], "baseURL": "http://10.0.2.2:3000", "data": undefined, "headers": {"Accept": "application/json, text/plain, */*"}, "maxContentLength": -1, "method": "get", "timeout": 3000, "transformRequest": [[Function transformRequest]], "transformResponse": [[Function transformResponse]], "url": "http://10.0.2.2:3000/img/user/5e208e4b1706ef2e00331ee8-1579191887321.jpeg", "validateStatus": [Function validateStatus], "xsrfCookieName": "XSRF-TOKEN", "xsrfHeaderName": "X-XSRF-TOKEN"}, "data": "", "headers": {"accept-ranges": "bytes", "access-control-allow-origin": "*", "cache-control": "public, max-age=0", "connection": "keep-alive", "content-length": "82599", "content-type": "image/jpeg", "date": "Thu, 16 Jan 2020 16:45:51 GMT", "etag": "W/\"142a7-16faf2be623\"", "last-modified": "Thu, 16 Jan 2020 16:24:47 GMT", "x-powered-by": "Express"}, "request": {"DONE": 4, "HEADERS_RECEIVED": 2, "LOADING": 3, "OPENED": 1, "UNSENT": 0, "_aborted": false, "_cachedResponse": undefined, "_hasError": false, "_headers": {"accept": "application/json, text/plain, */*"}, "_incrementalEvents": false, "_lowerCaseResponseHeaders": {"accept-ranges": "bytes", "access-control-allow-origin": "*", "cache-control": "public, max-age=0", "connection": "keep-alive", "content-length": "82599", "content-type": "image/jpeg", "date": "Thu, 16 Jan 2020 16:45:51 GMT", "etag": "W/\"142a7-16faf2be623\"", "last-modified": "Thu, 16 Jan 2020 16:24:47 GMT", "x-powered-by": "Express"}, "_method": "GET", "_requestId": null, "_response": "", "_responseType": "", "_sent": true, "_subscriptions": [], "_timedOut": false, "_trackingName": "unknown", "_url": "http://10.0.2.2:3000/img/user/5e208e4b1706ef2e00331ee8-1579191887321.jpeg", "readyState": 4, "responseHeaders": {"Accept-Ranges": "bytes", "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=0", "Connection": "keep-alive", "Content-Length": "82599", "Content-Type": "image/jpeg", "Date": "Thu, 16 Jan 2020 16:45:51 GMT", "ETag": "W/\"142a7-16faf2be623\"", "Last-Modified": "Thu, 16 Jan 2020 16:24:47 GMT", "X-Powered-By": "Express"}, "responseURL": "http://10.0.2.2:3000/img/user/5e208e4b1706ef2e00331ee8-1579191887321.jpeg", "status": 200, "timeout": 3000, "upload": {}, "withCredentials": true}, "status": 200, "statusText": undefined}
