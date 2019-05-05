const admin = require('firebase-admin');
const express = require('express');

const router = express.Router();
const db = require('../database/config')

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  databaseURL: 'https://vocappulary-239516.firebaseio.com',
});

router.post('/', (req, res) => {
  const idToken = req.body.idToken;
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      console.log(uid);
    }).catch((error) => {
      console.log(error);
    });
});

module.exports = router;