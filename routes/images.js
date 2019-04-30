require('dotenv').config();
const express = require('express');
const router = express.Router();
const Clarifai = require('clarifai');

const app = new Clarifai.App({ apiKey: process.env.CLARIFAI_KEY });

//Get array of probable object names for image

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