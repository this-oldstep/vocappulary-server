const express = require('express');
const router = express.Router();
const { db } = require('../database/models.js');



router.get('/:id/items', (req, res) => {

  const { id } = req.params;

  db.getAllCollectionItemsForUser(id)
    .then(collectionItems => {
      res.json(collectionItems)
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })

})

router.patch('/edit/', (req, res) => {
  // email is currently being ignored because of a need to interact with firebase.
  const { id, currentLanguageId, nativeLanguageId/* , email */ } = req.body

  db.editUser(id, currentLanguageId, nativeLanguageId/* , email */)
    .then(userRow => {
      res.status(200).json(userRow);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
})


module.exports = router;