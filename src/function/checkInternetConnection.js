import NetInfo from '@react-native-community/netinfo';

export default async () => {
  const state = await NetInfo.fetch();
  return state;
};
