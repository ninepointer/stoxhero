const admin = require('firebase-admin');

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('ascii'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


exports.sendIndividualNotification = async (title, body, token) => {
    const message = {
        notification: {
          title: title,
          body: body,
        },
        token: token
      };
    try {
        const res = await admin.messaging().send(message);
        console.log('Successfully sent message:', res);
        return res;
    } catch (e) {
        console.log('Error sending message:', e);    
    }  
}
exports.sendMultiNotifications = async (title, body, tokens) => {
    const message = {
        notification: {
          title: title,
          body: body,
        },
        tokens: tokens
      };
    try {
        const res = await admin.messaging().sendEachForMulticast(message);
        console.log('Successfully sent message:', res);
        return res;
    } catch (e) {
        console.log('Error sending message:', e);    
    }  
}

