const express = require('express');
const router = express.Router();
const { db } = require('../database/models.js');
const { isAuthenticated } = require('../middleware');

router.get('/all/', isAuthenticated, (req, res) => {

  const { id } = req.query;

  db.getBuddies(id)
    .then(buddiesList => {
      res.json(buddiesList);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })

})

module.exports = router;