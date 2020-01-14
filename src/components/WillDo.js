import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { withNavigation } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { CardContext } from '../context/CardContext';
import UserContext from '../context/UserContext';

const WillDo = ({ card, navigation, onSwipeLeft, onSwipeRight }) => {
  // Context

  const { checkBoxEdit } = useContext(CardContext);
  const { data: user } = useContext(UserContext);

  const [goal] = useState(card.itens);
  const [gradientColor, setGradientColor] = useState(['#f4511e', '#f88967']);

  const SCREEN_WIDTH = Dimensions.get('screen').width;

  useEffect(() => {
    verifyAllChecked();
  }, [card.itens]);

  const verifyAllChecked = () => {
    let numberCheckBox = 0;
    card.itens.forEach(elItem => {
      elItem.checkBoxValue === false ? numberCheckBox++ : null;
    });
    numberCheckBox > 0
      ? setGradientColor(['#f4511e', '#f88967'])
      : setGradientColor(['#34DA4F', '#75e687']);
  };

  const LeftActions = () => {
    return <View style={{ width: SCREEN_WIDTH }} />;
  };

  // ----------------------------RENDER----------------------
  return (
    <Swipeable
      renderLeftActions={LeftActions}
      onSwipeableLeftOpen={onSwipeLeft}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={gradientColor}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.secondContainer}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Card', { card })}
            style={styles.editIcon}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}> {card.date} eu vou...</Text>
            </View>

            <FlatList
              style={styles.itemList}
              data={card.itens}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <CheckBox
                    value={item.checkBoxValue}
                    onValueChange={() => {
                      checkBoxEdit(
                        { cardId: card.id, itemId: item.id },
                        user._id
                      );
                      verifyAllChecked();
                    }}
                  />
                  <Text
                    style={[
                      styles.textItem,
                      { textDecorationLine: item.textDecoration }
                    ]}
                  >
                    {item.goal}
                  </Text>
                  <Text
                    style={[
                      styles.textItemTime,
                      { textDecorationLine: item.textDecoration }
                    ]}
                  >
                    {item.time !== '' ? item.time : '----'}
                  </Text>
                </View>
              )}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 10,
    marginBottom: 1
  },
  secondContainer: {
    flex: 1,
    borderRadius: 20
  },
  itemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
    paddingRight: 10
  },
  itemList: {
    marginBottom: 10
  },
  title: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    borderBottomColor: 'black'
  },
  textItem: {
    flex: 1,
    borderRightWidth: 0.5,
    borderColor: 'gray',
    paddingRight: 4
  },
  textItemTime: {
    width: 38,
    paddingLeft: 2
  }
});

export default withNavigation(WillDo);
