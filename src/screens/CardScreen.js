import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FB from '../components/FloatingButton';
import RandomID from '../function/randomNumberId';
import { withNavigation } from 'react-navigation';
import dateHandler from '../function/dateHandler';
import Icon from 'react-native-vector-icons/FontAwesome';
import getMili from '../function/getMili';
import { backgroundColor } from '../constants/constants';

import { CardContext } from '../context/CardContext';

import UserContext from '../context/UserContext';

import useKeyboardShow from '../hooks/useKeyboardShow';

const CardScreen = ({ navigation }) => {
  // CONTEXT

  const { data: user } = useContext(UserContext);

  const { addCardList, editCardList } = useContext(CardContext);

  // Parâmetros de outras telas. Card vindo para ser editado.
  const cardEdit = navigation.getParam('card', '');
  const goalEdit = cardEdit.itens;

  // Definindo o goal padrão vazio

  const defaultGoal = {
    goal: '',
    id: RandomID('1'),
    firstPlaceHolder: 'Escreva aqui seu objetivo',
    focus: false,
    checkBoxValue: false,
    textDecoration: 'none',
    time: '',
    timeFull: ''
  };

  // Id que se está atualizando

  const [currentId, setCurrentId] = useState('');

  // Definindo valor inicial, se for vindo do Add, será valor padrão, se for vindo do Edit, será do valor do card selecionado

  const initialGoal = goalEdit ? goalEdit : [defaultGoal];

  // Lista com os itens do novo goal

  const [newGoalList, setNewGoalList] = useState(initialGoal);

  const [dateView, setDateView] = useState(false);
  const [dateValue, setDateValue] = useState(null);
  const [dateFull, setDateFull] = useState(null);
  const [dateCalender, setDateCalender] = useState(null);

  // Definindo se mostra ou não o botão plus

  const [plusButtonShow, setPlusButtonShow] = useState(true);

  // Definindo tipo do datePicker

  const [dateType, setDateType] = useState('date');

  // Definindo valor inicial para calendário
  const dateValueCalender = new Date();

  const eraseGoalItem = (id, goalText) => {
    if (goalText !== '') {
      return newGoalList.filter(goalMap => goalMap.id !== id);
    } else {
      return newGoalList;
    }
  };

  const textChangeHandle = (id, text) => {
    return newGoalList.map(goalMap => {
      return goalMap.id === id ? { ...goalMap, goal: text } : goalMap;
    });
  };

  const textSubmitHandle = () => {
    return newGoalList[newGoalList.length - 1].goal === ''
      ? [...newGoalList]
      : [...newGoalList, defaultGoal];
  };

  const submitNewGoal = () => {
    // newGoal === {date: '15 de Dezembro', dateFull: "12-12-2019", userId: 'gustavo',  id: 141, itens: [{goal: 'Escrever', id: 155}, {goal: 'ler', id: 235}]}
    let itemList = newGoalList.filter(
      item => item.goal !== '' && item.goal !== ' '
    );
    let newGoal = null;
    if (cardEdit) {
      newGoal = { ...cardEdit, date: dateValue, dateFull, itens: itemList };
      editCardList(newGoal, user._id);
    } else {
      newGoal = {
        date: dateValue,
        dateFull,
        id: RandomID('0'),
        itens: itemList,
        userId: user._id
      };
      addCardList(newGoal, user._id);
    }
    navigation.navigate('Home');
  };
  const dateHandleTop = (date, mode) => {
    setDateView(false);
    return dateHandler(date, mode);
  };

  // Verificar se tem mais de um item em branco

  const verifyEmptyItens = () => {
    let amountEmpty = 0;
    newGoalList.forEach(el => {
      el.goal === '' ? amountEmpty++ : null;
    });
    if (amountEmpty > 1) {
      newGoalList.pop();
    }
  };

  const timeHandle = id => {
    setDateType('time');
    setDateView(true);
    setCurrentId(id);
  };

  const timeChangeHandle = time => {
    const hour = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
    const minutes =
      time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
    setDateView(false);
    let newItemTime = [];
    newGoalList.forEach(elItem => {
      elItem.id === currentId
        ? newItemTime.push({
            ...elItem,
            time: `${hour}:${minutes}`,
            timeFull: timeUpdateHandle(time)
          })
        : newItemTime.push(elItem);
    });
    setNewGoalList(newItemTime);
  };

  const timeUpdateHandle = time => {
    const mili = getMili(time, 'half');
    const timeFinal = dateCalender + mili;
    return new Date(timeFinal);
  };

  const dateCalenderHandle = date => {
    const mili = getMili(date, 'all');
    const dateFinal = date.getTime() - mili;
    return dateFinal;
  };

  const itemTimeFullUpdate = date => {
    let newItemTime = [];
    let mili = null;
    let newItemTimeFull = null;
    const dateToUse = dateCalenderHandle(date);
    newGoalList.forEach(elItem => {
      if (elItem.timeFull !== '') {
        mili = getMili(elItem.timeFull, 'half');
        newItemTimeFull = new Date(dateToUse + mili);
        newItemTime.push({ ...elItem, timeFull: newItemTimeFull });
      } else {
        newItemTime.push(elItem);
      }
    });
    setNewGoalList(newItemTime);
  };

  try {
    newGoalList.length !== 0 ? null : setNewGoalList([defaultGoal]);
  } catch {}

  // Definir dateValue como Padrão

  useEffect(() => {
    if (cardEdit) {
      setDateValue(cardEdit.date);
      setDateFull(cardEdit.dateFull);
      setDateCalender(dateCalenderHandle(cardEdit.dateFull));
    } else {
      setDateValue(dateHandler(new Date(), 'text'));
      setDateFull(dateHandleTop(new Date(), 'full'));
      setDateCalender(dateCalenderHandle(new Date()));
    }
  }, []);

  const showKeyboard = () => {
    plusButtonHandleHide(false);
  };

  const hideKeayboard = () => {
    plusButtonHandleShow(true);
    verifyEmptyItens();
    textSubmitHandle();
  };

  useKeyboardShow(showKeyboard, hideKeayboard);

  // Resolvendo visibilidade dos botões

  const plusButtonHandleShow = () => {
    setPlusButtonShow(true);
  };
  const plusButtonHandleHide = () => {
    setPlusButtonShow(false);
  };

  // ---------------------------RENDER--------------------------------------

  return (
    <View style={styles.container}>
      {plusButtonShow && (
        <FB icon="plus" e={() => submitNewGoal()} buttonWidth={100} />
      )}

      {plusButtonShow && (
        <FB
          icon="close"
          e={() => navigation.navigate('Home')}
          buttonWidth={60}
          buttonRight={20}
        />
      )}

      <TouchableOpacity
        style={styles.containerDate}
        onPress={() => {
          setDateView(true);
          setDateType('date');
        }}
      >
        <Text style={styles.texto}>{dateValue}</Text>
        <Text style={styles.texto}> eu vou...</Text>
      </TouchableOpacity>

      <FlatList
        style={styles.listContainer}
        data={newGoalList}
        keyExtractor={item => (item.id ? item.id.toString() : '')}
        removeClippedSubviews={false}
        renderItem={({ item }) => {
          return (
            <View style={styles.goalContainer}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => timeHandle(item.id)}
              >
                {item.time === '' ? (
                  <Icon name="clock-o" style={styles.iconClock} />
                ) : (
                  <Text style={styles.timeText}>{item.time}</Text>
                )}
              </TouchableOpacity>

              <TextInput
                style={styles.goal}
                blurOnSubmit={true}
                multiline={true}
                autoFocus={true}
                placeholder={item.firstPlaceHolder}
                value={item.goal}
                onChangeText={text => {
                  setNewGoalList(textChangeHandle(item.id, text));
                }}
                onSubmitEditing={() => {
                  item.goal ? setNewGoalList(textSubmitHandle()) : null;
                }}
              />

              <TouchableOpacity
                style={styles.trashButton}
                onPress={() =>
                  setNewGoalList(eraseGoalItem(item.id, item.goal))
                }
              >
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      {dateView ? (
        <DateTimePicker
          value={dateValueCalender}
          mode={dateType}
          onChange={(event, newDate) => {
            switch (`${event.type}, ${dateType}`) {
              case 'set, date':
                setDateValue(dateHandleTop(newDate, 'text'));
                setDateFull(dateHandleTop(newDate, 'full'));
                setDateCalender(dateCalenderHandle(newDate));
                itemTimeFullUpdate(newDate);
                break;
              case 'set, time':
                timeChangeHandle(newDate);
                break;
              case 'dismissed, time':
              case 'dismissed, date':
                setDateView(false);
                break;
            }
          }}
        />
      ) : null}
    </View>
  );
};

CardScreen.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor
  },
  containerDate: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#f6774f'
  },
  texto: {
    fontSize: 18
  },
  listContainer: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    paddingBottom: 30,
    margin: 10,
    marginBottom: 20,
    backgroundColor: '#f6774f'
  },
  goalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  goal: {
    flex: 1,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    fontSize: 16,
    paddingLeft: 10
  },
  trashButton: {
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    width: 30,
    backgroundColor: '#f4511e',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  timeButton: {
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    width: 32,
    backgroundColor: '#f4511e',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  deleteText: {
    alignSelf: 'center',
    fontSize: 20,
    color: 'white',
    paddingLeft: 5
  },
  timeText: {
    alignSelf: 'center',
    fontSize: 10,
    color: 'white'
  },
  iconClock: {
    fontSize: 20,
    paddingLeft: 8
  }
});

export default withNavigation(CardScreen);
