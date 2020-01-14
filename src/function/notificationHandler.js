import { pushNotifications } from '../services';

const notificationHandler = (type, cardToCheck) => {
  switch (type) {
    case 'add':
      cardToCheck.itens.forEach(elItem => {
        if (
          elItem.timeFull !== '' &&
          elItem.timeFull > new Date(Date.now()) &&
          elItem.checkBoxValue === false
        ) {
          // console.log('vai notificar', elItem.goal, elItem.timeFull, elItem.id);
          pushNotifications.scheduleNotification(
            elItem.goal,
            elItem.timeFull,
            elItem.id
          );
        } else {
          // console.log(
          //   'não vai notificar',
          //   elItem.goal,
          //   elItem.timeFull,
          //   elItem.id,
          // );
        }
      });
      break;
    case 'cancel':
      cardToCheck.itens.forEach(elItem => {
        // console.log(
        //   'cancelou notificação',
        //   elItem.goal,
        //   elItem.timeFull,
        //   elItem.id,
        // );
        pushNotifications.cancelNotification(elItem.id);
      });
      break;
    case 'all':
      // console.log('cancelou todas as notificações');
      pushNotifications.cancelAllNotifications();
      break;
    default:
      break;
  }
};
export default notificationHandler;
