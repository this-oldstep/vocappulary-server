require('dotenv').config();
const express = require('express');
const router = express.Router();
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const AWS = require('aws-sdk');
const path = require('path');
const { googleSpeechToText } = require('../apiHelpers');
const { isAuthenticated } = require('../middleware')



AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var S3 = new AWS.S3();

let storeFile

router.post('/', (req, res) => {

  const { fileUploaded } = req.files;

  const { userId, currentLanguageId, word } = req.body;

  let audio = Buffer.from(fileUploaded.data).toString("base64");
//currentLanguageId, userId
  googleSpeechToText(audio, currentLanguageId, word, userId)
    .then(transcription => {
      res.send(transcription)
    });

});

module.exports = router;