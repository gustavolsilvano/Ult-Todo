import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { textColor } from '../constants/constants';

const FillField = ({
  field,
  marginTop,
  secure,
  onChangeTextInput,
  focus,
  setNext,
  resetNextFocus,
  initialValue
}) => {
  const [inputValue, setInputValue] = useState(initialValue);

  const inputRef = useRef();

  if (focus) {
    inputRef.current.focus();
    resetNextFocus();
  }

  const inputHandle = text => {
    setInputValue(text);
    onChangeTextInput(text);
  };

  const handleSubmit = () => {
    setNext();
  };

  return (
    <View style={[styles.container, { marginTop }]}>
      <Text style={styles.text}>{field}</Text>
      <TextInput
        ref={inputRef}
        value={inputValue}
        blurOnSubmit={false}
        onChangeText={text => inputHandle(text)}
        onSubmitEditing={handleSubmit}
        secureTextEntry={secure}
        style={styles.textInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%'
  },
  text: {
    fontSize: 18,
    color: textColor
  },
  textInput: {
    borderBottomWidth: 2,
    color: textColor
  }
});

export default FillField;
