const axios = require('axios');
const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');
const AWS = require('aws-sdk');
const path = require('path');
const client = new textToSpeech.TextToSpeechClient();
const speech = require('@google-cloud/speech');
const { getLanguageById } = require('./database/models.js')
const { Language, User } = require('./database/config.js')



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

  return Promise.resolve(new Promise(async (res, rej) => {
    await util.promisify(fs.writeFile)(`${word}.mp3`, (await client.synthesizeSpeech({
      input: { text: word },
      voice: { languageCode, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    }))[0].audioContent, 'binary');
    
    S3.upload({
      Bucket: 'vocapp-bucket',
      Body: fs.createReadStream(`./${word}.mp3`),
      Key: "words/" + path.basename(`./${word}.mp3`),
      ACL: 'public-read'
    }, function (err, data) {
      if (err) {
        console.log("Error", err);
        rej(err);
      }
      if (data) {
        fs.exists(`${word}.mp3`, (exists) => {
          if(exists) {
            fs.unlinkSync(`${word}.mp3`);
          }
        })
        console.log("Uploaded in:", data.Location);
        res(data.Location);
      }
    })
  }))
}



const googleSpeechToText = async (base64, currentLanguageId, word, userId) => {
  
  
  const client = new speech.SpeechClient();



  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  let language = await Language.findOne({
    where: {
      id: currentLanguageId
    }
  })
  if(!language.transSTT) {
    return null;
  };
  const audio = {
    content: base64,
  };
  const config = {
    encoding: 'AMR_WB',
    sampleRateHertz: 16000,
    languageCode: language.lang_code,
  };
  const request = {
    audio: audio,
    config: config,
  };
      const [response] = await client.recognize(request);
      const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
      if (transcription.includes(word)){
        let points = await User.findOne({
          where:{
            id: userId
          }
        })
        points = points.points + 1;
        User.update({
          points: points
        }, {
          where: {
            id: userId
          },
        })

        return true
      }
      else{
        return false
      }


  // Detects speech in the audio file
}



module.exports = {
  googleTranslate,
  googleTextToSpeech, 
  googleSpeechToText,
}