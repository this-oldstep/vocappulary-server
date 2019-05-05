require('dotenv').config();
const express = require('express');
const router = express.Router();
const { db } = require('../database/models.js')



router.post('/', (req, res) => {

  const { name, userId, public } = req.body;

  db.createCollection(userId, name, public)
  .then((response) => {
    res.status(200).json(response);
  }).catch((err) => {
    console.log(err);
  });
});

router.get('/', (req, res)=>{
  let { userId, } = req.body
  db.getAllCollections(userId)
  .then((result)=>{
    res.json(result)
  })
  .catch((err)=>{
    res.send(err)
  })
});


module.exports = router;