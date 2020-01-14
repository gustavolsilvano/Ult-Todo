import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { textColor } from '../constants/constants';

const Button = ({ text, callBack, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={() => callBack()}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};
// TODO caso não consiga conectar, dizer desde a tela de login, entrar como convidado

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 6,
    height: 50
  },
  text: {
    padding: 2,
    fontSize: 20,
    color: textColor
  }
});

export default Button;
