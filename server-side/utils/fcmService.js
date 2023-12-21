const admin = require('firebase-admin');

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('ascii'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


// exports.sendIndividualNotification = async (title, body, token) => {
//     const message = {
//         notification: {
//           title: title,
//           body: body,
//         },
//         token: token
//       };
//     try {
//         const res = await admin.messaging().send(message);
//         console.log('Successfully sent message:', res);
//         return res;
//     } catch (e) {
//         console.log('Error sending message:', e);    
//     }  
// }
// exports.sendMultiNotifications = async (title, body, tokens) => {
//     const message = {
//         notification: {
//           title: title,
//           body: body,
//         },
//         tokens: tokens
//       };
//     try {
//         const res = await admin.messaging().sendEachForMulticast(message);
//         console.log('Successfully sent message:', res);
//         return res;
//     } catch (e) {
//         console.log('Error sending message:', e);    
//     }  
// }
const messaging = admin.messaging();
exports.sendIndividualNotification = async (title, body, token, mediaUrl = null, actions = null) => {
  const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token
  };
  
  // Add mediaUrl and actions if they are provided
  if (mediaUrl || actions) {
      message.data = {};
      if (mediaUrl) {
          console.log('This is the image url', mediaUrl);  
          message.data.mediaUrl = mediaUrl;
          message.notification.image = mediaUrl;
      }
      if (actions) {
          message.data.actions = JSON.stringify(actions);
      }
  }

  try {
      console.log('sending this', message);  
      const res = await messaging.send(message);
      console.log('Successfully sent message:', res);
      return res;
  } catch (e) {
      console.log('Error sending message:', e);    
  }  
};

exports.sendMultiNotifications = async (title, body, tokens, mediaUrl = null, actions = null) => {
  const message = {
      notification: {
        title: title,
        body: body,
      },
      tokens: tokens
  };
  
  // Add mediaUrl and actions if they are provided
  if (mediaUrl || actions) {
      message.data = {};
      if (mediaUrl) {
          message.data.mediaUrl = mediaUrl;
          message.data.image = mediaUrl;
          message.notification.image = mediaUrl;
        //   message.notification.image = 'https://t4.ftcdn.net/jpg/02/57/42/55/360_F_257425552_3JqnRkyhqjiQcB95Ty2vBH9YMcErSpDM.jpg'
      }
      if (actions) {
          message.data.actions = JSON.stringify(actions);
      }
  }

  try {
      // console.log('sending this', message);  
      const res = await messaging.sendEachForMulticast(message);
      console.log('Successfully sent message');
      return res;
  } catch (e) {
      console.log('Error sending message:', e);    
  }  
};

