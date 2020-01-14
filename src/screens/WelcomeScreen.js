import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { backgroundColor, logo, logoStye } from '../constants/constants';
import { StackActions, NavigationActions } from 'react-navigation';
import Button from '../components/Button';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { width } from '../constants/constants';

const StartScreen = ({ navigation }) => {
  const homeScreenDefault = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })]
  });

  const handleGoHome = () => {
    navigation.dispatch(homeScreenDefault);
  };

  const thirdScreen = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.textTitle}>Terceira tela 😍😍!</Text>
      </View>
    );
  };

  const secondScreen = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.textTitle}>
          Nesse app você poderá determinar quais são seus objetivos de curto,
          médio e longo prazo 😍😍!
        </Text>
      </View>
    );
  };

  const firstScreen = () => {
    return (
      <View style={styles.containerLogo}>
        <Image style={styles.logo} source={logo} />

        <Text style={styles.textTitle}>BEM VINDO AO ULTIMATE ToDo APP</Text>
      </View>
    );
  };

  // TODO concluir swipable cards
  const secondCard = () => {
    return secondScreen();
  };

  return (
    <View style={styles.container}>
      <Swipeable renderRightActions={secondCard}>
        <View style={styles.containerLogo}>
          <Image style={styles.logo} source={logo} />

          <Text style={styles.textTitle}>BEM VINDO AO ULTIMATE ToDo APP</Text>
        </View>
      </Swipeable>
      <Button
        text="Vamos Começar!"
        callBack={handleGoHome}
        style={styles.button}
      />
    </View>
  );
};

StartScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width
  },
  textTitle: {
    fontSize: 20,
    color: 'white',
    marginTop: 20,
    marginHorizontal: 20
  },
  logo: {
    width: logoStye.width,
    height: logoStye.height
  },
  button: {
    marginBottom: 100
  }
});

export default StartScreen;
