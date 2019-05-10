require('dotenv').config();
const express = require('express');
const router = express.Router();
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const AWS = require('aws-sdk');



AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var S3 = new AWS.S3();

let storeFile

router.post('/newAudio', (req, res) => {

  storeFile = req.files

  res.sendStatus(200);

  /* (word, languageCode = 'en') => {

    const mp3Promise = new Promise((res, rej) => {
      const request = {
        input: { text: word },
        voice: { languageCode, ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      };
    
      // Performs the Text-to-Speech request
      // const [response] = await client.synthesizeSpeech(request);
      Promise.resolve(new Promise((res, rej) => {
        res(client.synthesizeSpeech(request))
      }))
      .then(([response]) => {
        const writeFile = util.promisify(fs.writeFile);
        // await writeFile(`${word}.mp3`, response.audioContent, 'binary');
        Promise.resolve(new Promise((res, rej) => {
          writeFile(`${word}.mp3`, response.audioContent, 'binary')
            .then(value => {
              res(value)
            })
            .catch(err => {
              rej(err)
            })
        }))
        .then(() => {
          console.log(`Audio content written to file: ${word}.mp3`);
        
          const filePath = `./${word}.mp3`;
        
          const params = {
            Bucket: 'vocapp-bucket',
            Body: fs.createReadStream(filePath),
            Key: "words/" + path.basename(filePath),
            ACL: 'public-read'
          };
        
          S3.upload(params, function (err, data) {
            if (err) {
              console.log("Error", err);
              rej(err);
            }
            if (data) {
              if (fs.exists(`${word}.mp3`)){
                fs.unlinkSync(`${word}.mp3`);
              }
              console.log("Uploaded in:", data.Location);
              res(data.Location);
            }
          })
        });
      })
      // Write the binary audio content to a local file
    })
    
    return Promise.resolve(mp3Promise)
  } */



})

module.exports = router;

// mp4 file encoded in aac