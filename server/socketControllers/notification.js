const webPush = require('web-push');

const sendPushNotification = async ({
  receiver,
  sender,
  message,
}) => {
  if (receiver.pushSubscriptions && receiver.pushSubscriptions.length > 0) {
    receiver.pushSubscriptions.forEach((sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth,
          p256dh: sub.p256dh,
        },
      };

      console.log('sending push notification');
      webPush
        .sendNotification(
          pushSubscription,
          JSON.stringify({
            title: sender.username,
            body: message.content,
            tag: message.id,
          })
        )
        .then(() => console.log('Push notification sent'))
        .catch((err) => console.log(err));
    });
  }
};

module.exports = sendPushNotification;
