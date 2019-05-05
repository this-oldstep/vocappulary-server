const admin = require('firebase-admin');
const express = require('express');

const router = express.Router();
const db = require('../database/config')

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  databaseURL: 'https://vocappulary-239516.firebaseio.com',
});

router.post('/', (req, res) => {
  const idToken = req.body.token;
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      const { uid } = decodedToken;
      console.log(uid);
      res.send(decodedToken);
    }).catch((error) => {
      console.log(error);
    });
});

router.get('/', (req, res) => {
  console.log(req);
  res.send('yhhharr');
});

module.exports = router;
