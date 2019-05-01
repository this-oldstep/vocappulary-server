require('dotenv').config();
const express = require('express');
const router = express.Router();
const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();


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
    console.log('Audio content written to file: output.mp3');
    res.send('done');
  }

main();

})



module.exports = router;