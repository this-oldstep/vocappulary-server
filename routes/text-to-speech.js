require('dotenv').config();
const express = require('express');
const router = express.Router();
const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');
const AWS = require('aws-sdk');
const path = require('path');
const client = new textToSpeech.TextToSpeechClient();


//Configuring AWS environment

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var S3 = new AWS.S3();




router.get('/:word', (req, res) => {

  const word = req.params.word;

  async function main() {

    const request = {
      input: { text: word },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(`${word}.mp3`, response.audioContent, 'binary');
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
        res.send(err);
      }
      if (data) {
        fs.unlinkSync(`${word}.mp3`);
        console.log("Uploaded in:", data.Location);
        res.send('uploaded at: ' + data.Location);
      }
    });


  }

  main();

})



module.exports = router;