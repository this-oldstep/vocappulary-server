const express = require('express');
const router = express.Router();
const { db } = require('../database/models.js');



router.post('/', (req, res) => {

  const {username, email, currentLanguageId, nativeLanguageId} = req.body;
  
  db.makeUser(username, email, currentLanguageId, nativeLanguageId)
    .then(userRow => {
      res.status(200).json(userRow);
    })
})



router.get('/', (req, res) => {
  
  const { username } = req.body;

  db.findUser(username)
    .then(userRow => {
      res.json(userRow)
    })
})



module.exports = router;