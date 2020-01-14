import React, { useState, useEffect, useContext } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { CardContext } from '../context/CardContext';
import WillDo from '../components/WillDo';
import FB from '../components/FloatingButton';
import FT from '../components/FloatingTouchable';
import loadingCardsHandle from '../function/loadingCardsHandle';

import LoadingContext from '../context/LoadingContext';
import UserContext from '../context/UserContext';

// Constantes
import { backgroundColor } from '../constants/constants';

const HomeScreen = ({ navigation }) => {
  const { data } = useContext(UserContext);

  const guest = { name: 'visitante', _id: 'visitante' };
  const user = data || guest;

  console.log('ID', user._id);
  // CONTEXT
  const {
    state: listContext,
    removeCardList,
    addCardList,
    loadingCard,
    setSync
  } = useContext(CardContext);
  console.log('state', listContext);

  const handleLoading = useContext(LoadingContext);
  // TODO indicar caso não tenha internet

  const [tempList, setTempList] = useState([]);

  // Primeira inicialização
  useEffect(() => {
    handleLoading(true, 'Carregando...');
    loadingCardsHandle(loadingCard, user._id, canStartSync);
  }, []);

  const canStartSync = () => {
    setSync(user._id, 'start');
    handleLoading(false, '');
  };

  // Recuperar card deletado
  const [canTouchToRetrive, setCanTouchToRetrive] = useState(true);

  const retriveCard = () => {
    if (canTouchToRetrive) {
      addCardList(tempList, user._id);
      setCanTouchToRetrive(false);
    }
  };

  // Seta timer para 23:59 para atualizar os títulos dos cards

  // const setTimeUpdateTimer = () => {
  //     const MILI_TO_MIDNIGHT = 1000 * 60 * 60 * 24 - 1 //23:59:59:999
  //     const miliNow = getMili(new Date(Date.now()), 'all');
  //     BackgroundTimer.setTimeout(() => {
  //         loadingCard(listContext);
  //         setTimeUpdateTimer();
  //     }, MILI_TO_MIDNIGHT - miliNow)
  // };

  // Animação fade botão

  const [floatingMessageCardDelete, setFloatingMessageCardDelete] = useState(
    false
  );

  const handleNotificationDelete = () => {
    setFloatingMessageCardDelete(false);
    setCanTouchToRetrive(true);
  };

  // --------------------------------- RENDER --------------------------------------
  return (
    <View style={styles.container}>
      <FB icon="plus" e={() => navigation.navigate('Card')} buttonWidth={100} />
      <FB
        icon="gear"
        e={() => navigation.navigate('Conf')}
        buttonWidth={40}
        buttonLeft={20}
      />
      <FT
        effectEnded={handleNotificationDelete}
        text="Card deletado. Aperte aqui para desfazer."
        onFloatingPress={retriveCard}
        show={floatingMessageCardDelete}
      />
      {listContext.length > 0 ? (
        <FlatList
          style={styles.listContext}
          data={listContext}
          keyExtractor={item => item.date}
          renderItem={({ item }) => {
            return (
              <WillDo
                card={item}
                onSwipeLeft={() => {
                  setTempList(item);
                  removeCardList(item, user._id);
                  setFloatingMessageCardDelete(true);
                  setCanTouchToRetrive(true);
                }}
              />
            );
          }}
        />
      ) : null}
    </View>
  );
};

HomeScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor
  },
  listContext: {
    flex: 1,
    marginVertical: 10
  }
});

export default HomeScreen;
