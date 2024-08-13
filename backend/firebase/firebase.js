const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_URL
})

const storage = admin.storage();

module.exports = {admin, storage};