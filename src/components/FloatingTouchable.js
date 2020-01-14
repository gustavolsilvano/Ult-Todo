import React, { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

const FloatingTouchable = ({ effectEnded, text, onFloatingPress, show }) => {
  const useFade = () => {
    const opacityMessage = useRef(new Animated.Value(0)).current;

    const changeOpacity = () => {
      Animated.sequence([
        Animated.timing(opacityMessage, { toValue: 1, duration: 500 }),
        Animated.timing(opacityMessage, {
          toValue: 0,
          duration: 1000,
          delay: 2000
        })
      ]).start(effectEnded);
    };

    useEffect(() => {
      setTimeout(() => changeOpacity(), 0);
    }, []);

    return opacityMessage;
  };

  return (
    <>
      {show ? (
        <TouchableOpacity
          style={styles.touchableNotificationContainer}
          onPress={onFloatingPress}
        >
          <Animated.View style={[styles.container, { opacity: useFade() }]}>
            <Text style={styles.text}>{text}</Text>
          </Animated.View>
        </TouchableOpacity>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D9DDDC',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 25
  },
  text: {
    fontSize: 14,
    color: 'black'
  },
  touchableNotificationContainer: {
    flex: 1,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 26,
    zIndex: 10
  }
});

export default withNavigation(FloatingTouchable);
