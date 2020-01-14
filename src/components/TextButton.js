import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { textColor } from '../constants/constants';

const TextButton = ({ text, callBack }) => {
  return (
    <TouchableOpacity onPress={() => callBack()}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    color: textColor
  }
});

export default TextButton;
