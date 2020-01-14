import { loadList } from './localStorageHandle';
import server from '../api/server';
import compareArrays from './compareArrays';

const getCardDB = async userId => {
  try {
    const response = await server.get(`/card/${userId}`);
    return response.data.data.cards;
  } catch (err) {
    console.log('Falha ao carregar cards do servidor', err);
    return;
  }
};

const loadingCardsHandle = async (loadingCard, userId, callback) => {
  let localList = await loadList(userId);
  let dbList = await getCardDB(userId);

  let returnList;
  if (localList && localList.lenght > 0 && dbList && dbList.lenght > 0) {
    returnList = compareArrays(localList, dbList);
  } else {
    returnList = localList || dbList;
  }
  console.log({ returnList });
  loadingCard(returnList, userId);
  callback();
};

export default loadingCardsHandle;
