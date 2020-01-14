import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation';

// icon é o nome do icone que será utilizado;
// e é o evento que será chamado quando pressionado;
// buttonLeft é a distância da esquerda até o botão;
// buttonWidth é a largura do botão;

const FloatingButton = ({ icon, e, buttonLeft, buttonWidth, buttonRight }) => {
  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          { width: buttonWidth },
          { left: buttonLeft },
          { right: buttonRight }
        ]}
        onPress={e}
      >
        <Icon style={styles.icon} name={icon} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderWidth: 0,
    borderRadius: 16,
    backgroundColor: '#f4511e',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    bottom: 10,
    zIndex: 2,
    height: 32
  },
  icon: {
    fontSize: 16,
    color: 'white'
  }
});

export default withNavigation(FloatingButton);
