require('dotenv').config();
const express = require('express');
const router = express.Router();
const { db } = require('../database/models.js');


/**
 * takes collectionId
 * gets an array of all the collection items of a collection with their native transltion, current translation, collectionItemId, and image url
 */
router.get('/:id', (req,res)=>{


  db.getAllCollectionItems(req.params.id)
    .then(collection => {
      res.json(collection)
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(404)
    });
})

/**
 * takes collectionId, imgUrl, and wordId
 * creates a new collection item, and adds a translation of the word if nessisary
 */
router.post('/', (req,res) => {

  const { collectionId, imgUrl, wordId } = req.body;
  
  db.makeNewCollectionItem(collectionId, imgUrl, wordId)
    .then(item => {
      res.status(200).json(item);
    })
    .catch(err => {
      res.status(400).send('There was an error making new item')
      console.error(err);
    });
})

module.exports = router;