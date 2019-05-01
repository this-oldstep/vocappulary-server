require('dotenv').config();
const express = require('express');
const router = express.Router();
const fs = require('fs');
const util = require('util');


router.get('/:word', (req, res) => {


  const word = req.params.word;
  console.log(word);
  // Import other required libraries
  async function main() {
    // Creates a client
    const client = new textToSpeech.TextToSpeechClient();

    // The text to synthesize
    const text = 'Hello, world!';

    // Construct the request
    const request = {
      input: { text: text },
      // Select the language and SSML Voice Gender (optional)
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      // Select the type of audio encoding
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
    res.send('done');
  }





})



module.exports = router;