require('dotenv').config();
const express = require('express');
const router = express.Router();
const { db } = require('../database/models.js');


router.get('/', (req,res)=>{
  db.getAllCollectionItems(req.body.collectionId)
    .then(collection => {
      res.json(collection)
    })
    .catch(err => {
      console.error(err);
    })
})

router.post('/', (req,res) => {
  
})

module.exports = router;