import PushNotification from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';

const configure = () => {
 PushNotification.configure({

   onRegister: function(token) {
     //process token
   },

   onNotification: function(notification) {
     // process the notification
     // required on iOS only
     notification.finish(PushNotificationIOS.FetchResult.NoData);
   },

   permissions: {
     alert: true,
     badge: true,
     sound: true
   },

   popInitialNotification: true,
   requestPermissions: true,

 });
};

const localNotification = () => {
    PushNotification.localNotification({
      
    });
   };
   
const scheduleNotification = (goalTitle, dateSetted, id) => {
    PushNotification.localNotificationSchedule({
        autoCancel: false,
        id: id,
        title: goalTitle,
        message: "Notification Message",
        bigText: "My big text that will be shown when notification is expanded",
        color: '#f4511e',
        actions: '["Accept", "Reject"]',
        date: dateSetted // in 60 secs
    });
};

const cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications()
};

const cancelNotification = id => {
  PushNotification.cancelLocalNotifications({id});
}
   
   export {
    configure,
    localNotification,
    scheduleNotification,
    cancelAllNotifications,
    cancelNotification,
};
