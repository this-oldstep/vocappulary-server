require('dotenv').config();
const express = require('express');
const router = express.Router();
const Clarifai = require('clarifai');

const app = new Clarifai.App({ apiKey: process.env.CLARIFAI_KEY });

//Get array of probable object names for image


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


router.post('/', (req, res) => {

  const url = req.body.url;

  app.models.predict(Clarifai.GENERAL_MODEL, url)
    .then((response) => {
      res.send(response);
    }).catch((err) => {
      console.log(err);
    });

});


module.exports = router;