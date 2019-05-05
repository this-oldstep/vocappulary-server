const admin = require('firebase-admin');
const express = require('express');

const router = express.Router();
const { db } = require('../database/models');

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  databaseURL: 'https://vocappulary-239516.firebaseio.com',
});

router.post('/', (req, res) => {
  const idToken = req.body.token;
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      const {
        username, email, currentLanguageId, nativeLanguageId,
      } = req.body;
      if (req.body.newUser) {
        return db.makeUser(username, email, currentLanguageId, nativeLanguageId, 0);
      }
      return db.findUser(email);
    }).then((result) => {
      console.log(result);
      res.send(result.dataValues);
    })
    .catch((err) => {
      res.send(err);
    });
});


module.exports = router;
