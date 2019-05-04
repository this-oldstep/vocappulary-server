require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../database/config');


router.get('/', (req,res)=>{
  let item = {};
  let userId = req.body.userId;
  let collectionId =req.body.collectionId
  let learningLang = req.body.learningLang
  let nativeLang = req.body.nativeLang
  db.CollectionItem.findAll({
    where:{
      collectionId: collectionId
    }
  })
  .then((result)=>{
    item.wordId = result.WORDPLACEHOLDER;// PLACEHOLDER
    item.imgUrl = result.IMGPLACEHOLDER;//---------------------------------------
    db.Translation.findAll({
      where:{
        wordId: wordId,
        languageId: learningLang,
      }
    })
    .then((learningWord)=>{
      item.learningLang = learningWord.languageID//---------------------
    })
    .then((result)=>{
      db.Translation.findAll({
        where:{
          wordId: wordId,
          languageId: nativeLang 
        }
      })
      .then((nativeWord)=>{
        item.nativeLang = nativeWord.languageID;//-------------------------
        res.send(item);
      })
    })
    .catch((err)=>{
      res.send(err)
    })
  })
})

router.post('/', (req,res) => {
  
})

module.exports = router;