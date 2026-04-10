const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

function initializeFirebase() {
  if (admin.apps.length) return admin.firestore();

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH && process.env.NODE_ENV !== 'production') {
    const serviceAccount = require(
      path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  return admin.firestore();
}

const db = initializeFirebase();

module.exports = db;
