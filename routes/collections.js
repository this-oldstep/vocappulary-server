require('dotenv').config();
const express = require('express');
const router = express.Router();
const { db } = require('../database/models.js')
const { isAuthenticated } = require('../middleware');

/**
 * takes name, userId, and public
 * creates a new collection
 */
router.post('/', isAuthenticated, (req, res) => {

  const { name, userId, public } = req.body;

  db.createCollection(userId, name, public)
  .then((response) => {
    res.status(200).json(response);
  }).catch((err) => {
    console.log(err);
  });
});

/**
 * takes userId
 * gets all collections related to a user
 */
router.post('/get', isAuthenticated, (req, res)=>{
  
  let { userId } = req.body
  
  db.getAllCollections(userId)
  .then((result)=>{
    res.json(result)
  })
  .catch((err)=>{
    res.send(err)
  })
});


module.exports = router;