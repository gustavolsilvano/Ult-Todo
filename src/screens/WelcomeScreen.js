import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  ScrollView
} from 'react-native';
import { backgroundColor, logo, logoStye, width } from '../constants/constants';
import { StackActions, NavigationActions } from 'react-navigation';
import Button from '../components/Button';

const StartScreen = ({ navigation }) => {
  const scrollRef = useRef(null);
  const [x, setX] = useState(null);
  const [circleBGC, setCircleBGC] = useState({
    circle1: 'black',
    circle2: 'white',
    circle3: 'white'
  });

  console.log({ x });

  const handleEndScroll = () => {
    if (x < width / 2) {
      setCircleBGC({ circle1: 'black', circle2: 'white', circle3: 'white' });
      scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
    } else if (x >= width / 2 && x < width + width / 2) {
      setCircleBGC({ circle1: 'white', circle2: 'black', circle3: 'white' });
      scrollRef.current.scrollTo({ x: width, y: 0, animated: true });
    } else if (x >= width + width / 2 && x < 2 * width) {
      setCircleBGC({ circle1: 'white', circle2: 'white', circle3: 'black' });
      scrollRef.current.scrollTo({
        x: 2 * width,
        y: 0,
        animated: true
      });
    }
  };

  const firstScreen = () => {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>Primeira tela</Text>
      </View>
    );
  };

  const secondScreen = () => {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>Segunda tela</Text>
      </View>
    );
  };

  const thirdScreen = () => {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>Terceira tela</Text>
      </View>
    );
  };

  const homeScreenDefault = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })]
  });

  const handleGoHome = () => {
    navigation.dispatch(homeScreenDefault);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        horizontal={true}
        onScroll={event => {
          setX(event.nativeEvent.contentOffset.x);
        }}
        onScrollEndDrag={handleEndScroll}
        showsHorizontalScrollIndicator={false}
      >
        {firstScreen()}
        {secondScreen()}
        {thirdScreen()}
      </ScrollView>
      <View style={styles.containerCircle}>
        <View style={[styles.circle, { backgroundColor: circleBGC.circle1 }]} />
        <View style={[styles.circle, { backgroundColor: circleBGC.circle2 }]} />
        <View style={[styles.circle, { backgroundColor: circleBGC.circle3 }]} />
      </View>
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
    alignItems: 'center',
    zIndex: 1
  },
  containerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width,
    flexDirection: 'row'
  },
  button: {
    marginBottom: 100
  },
  scroll: {
    flex: 1
  },
  view: {
    flex: 1,
    width,
    backgroundColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'red',
    marginHorizontal: 10
  },
  text: {
    fontSize: 20
  }
});

export default StartScreen;
