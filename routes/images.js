const express = require('express');
const router = express.Router();
const Clarifai = require('clarifai');
var cloudinary = require('cloudinary').v2;
// const axios = require('axios');
const { googleTranslate } = require('../apiHelpers');
const { User } = require('../database/config');

const app = new Clarifai.App({ apiKey: process.env.CLARIFAI_KEY });

const { db } = require('../database/models');
//Get array of probable object names for image


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Flow =>
// 1.- FE -> image is taken with camera and sent as base64 encoded to cloudinary
// 2.- FE -> cloudinary sends back an image url, which is sent through HTTP to the server POST /images
// 3.- BA -> image route sends URL to clarifai to get the list of Words && image is stored in DB 
// 4.- BA -> Sent back to the server the storage id and the array of possible words
// ----------------
// 4.- FE -> user goes through array of words to confirm what the object is and sends back selected word to GET /texttospeech
// 5.- BA -> word has to be translated to language that you're learning at the moment with _____ API
// 6.- BA -> word is then encoded into ?? sent to s3, get URL 
// 7.- BA -> server sends back to client the translated word && the URL for pronunciation && also completes item table in DB

//returns translation columns in the native language from the database, and takes the pic 
router.post('/', (req, res) => {

  let pic = req.body.base64
  let { userId } = req.body
  let url;
  cloudinary.uploader.upload(`data:image/png;base64,${pic}`, function (error, result) {
    if (error) {
      console.log(error)
    }
    else {
      User.findOne({
        where: {
          id: userId
        }
      })
      .then(userCol => {
        return userCol.getNative_language()
      })
      .then(({lang_code}) => {
        const nativeLanguage = lang_code;
        url = result.secure_url
        app.models.predict(Clarifai.GENERAL_MODEL, url)
          .then(({ outputs }) => {
            // gets the array of images from the clarifai object
            const { concepts } = outputs[0].data;
            // maps and filters the clarifai object down to the first five strings related to the image ignoring all "no person" strings
            const imagesArr = concepts.reduce((seed, conceptData) => {
              if (conceptData.name !== "no person" && seed.length < 5) {
                seed.push(conceptData.name)
              }
              return seed;
            }, []);
            // checks words returned by image and returns the words that need translations.
            db.checkWords(imagesArr, nativeLanguage)
              .then(({ completeWords, incompleteWords }) => {
                // makes an array of promises to get translation
                const completeTranslationPromises = completeWords.map(word => 
                  new Promise((res, rej) => {
                    db.getTranslation(word.id, nativeLanguage)
                      .then(translationRow => res(translationRow));
                  }
                ));
                // runs promises
                return Promise.all(completeTranslationPromises)
                  .then(completeTranslations => {
                    // an array of promises that gets the english translation, translates the word to the native language, stores it in the database, and returns the newly created rows 
                    const translationPromises = incompleteWords.map(word => 
                      new Promise((res, rej) => {
                        db.getTranslation(word.id, "en")
                          .then(englishRow => {
                            return googleTranslate(englishRow.text, "en", nativeLanguage)
                          })
                          .then(translatedText => {
                            return db.addTranslationToWord(word.id, nativeLanguage, translatedText)
                          })
                          .then(translatedRows => {
                            res(translatedRows);
                          })
                          .catch(err => {
                            console.error(err);
                          })
                      }
                    ));
                    // runs promises
                    return Promise.all(translationPromises)
                      .then(newlyCompleteTranslations => {
                        let allData = completeTranslations.concat(newlyCompleteTranslations).map((langRow)=>{
                          return {
                            wordId: langRow.wordId,
                            translationId: langRow.id,
                            languageId: langRow.languageId,
                            text: langRow.text
                          };
                        })
                        res.send({ 
                          data: allData,
                          imgUrl: url
                        });
                      });
                  });
              });
          }).catch((err) => {
            console.log(err);
          });
      })
    }
  });
});


// ROUTE TO SELECT A PHOTO FROM SELECTION
router.post('/select/:wordId/:collectionId', (req, res)=>{
  // let text = req.body.text;
  let wordId = req.params.wordId;
  let collectionId = req.params.collectionId;
  let url = req.body.url
  db.selectWord(wordId, collectionId, url)
    .then((result)=>{
      res.send(result)
    })
    .catch((err)=>{
      res.send(err)
    })
  })
  
  



module.exports = router;