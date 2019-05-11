require('dotenv').config();
const express = require('express');
const router = express.Router();
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const AWS = require('aws-sdk');
const path = require('path');
const { googleSpeechToText } = require('../apiHelpers');



AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var S3 = new AWS.S3();

let storeFile

router.post('/', (req, res) => {

  const { fileUploaded } = req.files;

  let audio = Buffer.from(fileUploaded.data).toString("base64");

  googleSpeechToText(audio)
    .then(transcription => {
      console.log(transcription);
    });

});

module.exports = router;