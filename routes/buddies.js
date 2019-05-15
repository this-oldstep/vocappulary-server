const express = require('express');
const router = express.Router();
const { db } = require('../database/models.js');
const { isAuthenticated } = require('../middleware');

router.get('/all/:userId', isAuthenticated, (req, res) => {

  const { userId } = req.params;

  db.getBuddies(userId)
    .then(buddiesList => {
      res.json(buddiesList);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })

})

module.exports = router;