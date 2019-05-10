const axios = require('axios');
const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');
const AWS = require('aws-sdk');
const path = require('path');
const client = new textToSpeech.TextToSpeechClient();
const speech = require('@google-cloud/speech');
const btoa = require('btoa');


//Configuring AWS environment


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var S3 = new AWS.S3();


/**
 * 
 * @param {string} word - word to be translated
 * @param {string} from - language code for the language the word is in 
 * @param {string} to - language code for the langage to translate the word to
 * @returns tranlated text
 */
const googleTranslate = (word, from, to) => {
  const translatePromise = new Promise((res, rej) => {
    axios.get(`https://www.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANS_API}&source=${from}&q=${word}&target=${to}`)
      .then((result) => {
        const translation = result.data.data.translations[0].translatedText
        res(translation)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return Promise.resolve(translatePromise);
};



const googleTextToSpeech = (word, languageCode = 'en') => {

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
}



const googleSpeechToText = async (binary) => {

  // Imports the Google Cloud client library
  // const speech = require('@google-cloud/speech');
  // const fs = require('fs');
  
  // Creates a client
  const client = new speech.SpeechClient();

  // The name of the audio file to transcribe
  // const fileName = `./resources/audio.raw`;

  // Reads a local audio file and converts it to base64
  // const file = fs.readFileSync(fileName);
  // const audioBytes = file.toString('base64');
  const audioBytes = btoa(binary);

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);
}


(async() => {
  let yeetus = await fs.readFileSync('./word.mp3')
  googleSpeechToText(yeetus)
    .then(lmao => {
      console.log(lmao)
    })
    .catch(err => {
      console.error(err);
    })
})()


module.exports = {
  googleTranslate,
  googleTextToSpeech, 
}