import AsyncStorage from '@react-native-community/async-storage';

const saveList = async (newList, userId) => {
  try {
    await AsyncStorage.setItem(`goals-${userId}`, JSON.stringify(newList));
    // console.log('salvo com sucesso', newList);
  } catch (e) {
    console.error('erro: ', e);
  }
};

const loadList = async userId => {
  try {
    let loadData = await AsyncStorage.getItem(`goals-${userId}`);
    if (loadData) {
      const parsedData = JSON.parse(loadData);
      return parsedData;
    }
    return;
  } catch (e) {
    console.log('erro ao carregar', e);
  }
};

const deleteAll = async () => {
  await AsyncStorage.removeItem('goals');
};

export { saveList, loadList, deleteAll };
