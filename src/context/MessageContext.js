import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FloatingWarning from '../components/FloatingWarning';
const MessageContext = React.createContext();

export const MessageProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');

  const checkError = err => {
    console.log('error', err);
    if (typeof err === 'string') return err;
    if (err.message && err.message.startsWith('timeout of'))
      return 'Não foi possivel conectar com o servidor. Tente novamente mais tarde.';
    return err.response.data.message;
  };
  // TODO escolher cor de fundo
  const checkResponse = res => {
    return res.data.message;
  };

  const handleWarning = (isShow, msg, type) => {
    if (type === 'error') textToShow = checkError(msg);
    if (type === 'response') textToShow = checkResponse(msg);
    setShow(isShow);
    setText(textToShow);
  };
  return (
    <MessageContext.Provider value={handleWarning}>
      <View style={styles.container}>
        <FloatingWarning
          show={show}
          text={text}
          effectEnded={() => setShow(false)}
        />
        {children}
      </View>
    </MessageContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 100,
    zIndex: 100
  }
});

export default MessageContext;
