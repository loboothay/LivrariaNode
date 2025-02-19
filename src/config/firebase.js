const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

const serviceAccount = require('../../firebase-credentials.json');

// Admin SDK initialization
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Firebase Client initialization
const firebaseConfig = {
    apiKey: "AIzaSyDFGpZ090dNaMdhG2xGzSqHe5uUpX_Ayj0",
    authDomain: "livrarianode.firebaseapp.com",
    projectId: "livrarianode",
    storageBucket: "livrarianode.firebasestorage.app",
    messagingSenderId: "376456231434",
    appId: "1:376456231434:web:8735aab32324552a2bfdf3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { db, auth, admin };