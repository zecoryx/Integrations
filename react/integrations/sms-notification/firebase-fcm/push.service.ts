// @ts-nocheck
import * as admin from 'firebase-admin';

// Service Account JSON fayli kerak bo'ladi (Firebasedan yuklab olinadi)
// const serviceAccount = require('./service-account.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

export class PushNotificationService {

    /**
     * Bitta foydalanuvchiga xabar yuborish
     */
    async sendToDevice(token: string, title: string, body: string) {
        try {
            const message = {
                notification: { title, body },
                token: token,
                data: {
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    screen: '/news/123' 
                }
            };

            const response = await admin.messaging().send(message);
            console.log("Successfully sent message:", response);
            return true;
        } catch (error) {
            console.error("Error sending message:", error);
            return false;
        }
    }

    /**
     * Barchaga xabar yuborish (Topic: 'all')
     */
    async sendToTopic(topic: string, title: string, body: string) {
        try {
            const message = {
                notification: { title, body },
                topic: topic,
            };

            const response = await admin.messaging().send(message);
            console.log("Topic message sent:", response);
            return true;
        } catch (error) {
            console.error("Error sending topic message:", error);
            return false;
        }
    }
}