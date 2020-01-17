import createContext from './createContext';
import removeSameDateArray from '../function/removeSameDateArray';
import notificationHandler from '../function/notificationHandler';
import { saveList } from '../function/localStorageHandle';
import sortCards from '../function/sortCards';
import dateHandler from '../function/dateHandler';
import server from '../api/server';
import { delay } from '../constants/constants';
import BackgroundTimer from 'react-native-background-timer';

const listReducer = (state, action) => {
  let newList = [];

  switch (action.type) {
    case 'addCard':
      newList = [...state, action.payload];
      notificationHandler('add', action.payload);
      break;

    case 'removeCard':
      newList = state.filter(el => el.id !== action.payload.id);
      notificationHandler('cancel', action.payload);
      break;

    case 'editCard':
      state.forEach(elList => {
        if (elList.id === action.payload.id) {
          notificationHandler('cancel', elList);
          elList = action.payload;
          notificationHandler('add', action.payload);
        }
        newList.push(elList);
      });
      break;

    case 'checkBoxEdit':
      for (let elList of state) {
        if (elList.id === action.payload.cardId) {
          notificationHandler('cancel', elList);
          for (let elItem of elList.itens) {
            if (elItem.id === action.payload.itemId) {
              elItem.checkBoxValue = !elItem.checkBoxValue;
              elItem.checkBoxValue
                ? (elItem.textDecoration = 'line-through')
                : (elItem.textDecoration = 'none');
            }
          }
          notificationHandler('add', elList);
        }
      }
      newList = state;
      break;

    case 'loadingCard':
      // Cancelando todas as notificações
      notificationHandler('all');

      // carregando lista
      const loadedList = action.payload;

      // Ajustando as datas para passarem de string para Date
      for (let data of loadedList) {
        data.dateFull = new Date(data.dateFull);
        data.date = dateHandler(data.dateFull, 'text');

        // Ajustando as datas dos itens
        for (let dataItem of data.itens) {
          if (dataItem.timeFull) {
            dataItem.timeFull = new Date(dataItem.timeFull);

            // Verificando se vai notificar os itens
            notificationHandler('add', data);
          }
        }
      }

      newList = loadedList;
      break;

    case 'sync':
      server.delete(`/card/${action.userId}`).then(() => {
        console.log('deletado cards');
        if (state.length > 0) {
          for (const data of state) {
            server
              .post('/card', data)
              .then(() => console.log('adicionado', data));
          }
        }
        global.lastSync = new Date();
      });
      return state;

    default:
      newList = state;
      break;

    case 'logOff':
      return [];
  }

  // Sorting a lista de cards
  const newListSingle = removeSameDateArray(newList);
  const newListSort = sortCards(newListSingle);

  // Salvando lista de cards localmente
  saveList(newListSort, action.userId);

  // Aglomerando cards que possuem mesma data em um card so e retornando para a função
  return newListSort;
};

const addCardList = dispatch => {
  return (payload, userId) => {
    dispatch({ type: 'addCard', payload, userId });
  };
};

const removeCardList = dispatch => {
  return (payload, userId) => {
    dispatch({ type: 'removeCard', payload, userId });
  };
};

const editCardList = dispatch => {
  return (payload, userId) => {
    dispatch({ type: 'editCard', payload, userId });
  };
};

const checkBoxEdit = dispatch => {
  return (payload, userId) => {
    dispatch({ type: 'checkBoxEdit', payload, userId });
  };
};

const loadingCard = dispatch => {
  return (payload, userId) => {
    dispatch({ type: 'loadingCard', payload, userId });
  };
};

const logOff = dispatch => {
  return () => {
    dispatch({ type: 'logOff' });
  };
};

// -------------------SET TIME----------------------
let idTime;
const setSync = dispatch => {
  return (userId, event) => {
    switch (event) {
      case 'start':
        if (!idTime)
          idTime = BackgroundTimer.setInterval(
            () => dispatch({ type: 'sync', userId }),
            delay
          );
        break;

      case 'stop':
        clearInterval(idTime);
        idTime = null;
        break;

      case 'now':
        dispatch({ type: 'sync', userId });
        break;

      default:
        break;
    }
  };
};

const { Context, Provider } = createContext(
  listReducer,
  {
    addCardList,
    removeCardList,
    editCardList,
    checkBoxEdit,
    loadingCard,
    setSync,
    logOff
  },
  []
);

const CardContext = Context;
const CardProvider = Provider;

export { CardContext, CardProvider };
