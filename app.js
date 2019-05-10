require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const { db } = require("./database/models")
const fileUpload = require('express-fileupload')

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(bodyParser.json({ type: 'application/json'}));

///////////////
/// Routes ////
///////////////


const images = require('./routes/images');
const textToSpeech = require('./routes/text-to-speech.js');
const collections = require('./routes/collections');
const collectionItems = require('./routes/collectionItems');
const auth = require('./routes/auth');
const user = require('./routes/user');
const speechToText = require('./routes/speech-to-text')

///////////////

app.use('/images', images);
app.use('/texttospeech', textToSpeech);
app.use('/collections', collections);
app.use('/collectionItems', collectionItems);
app.use('/auth', auth);
app.use('/user', user);
app.use('/speechtotext', speechToText);

///////////////


/**
 * returns all languages
 */
app.get('/languages', (req, res) => {
  db.getAllLanguages()
    .then(languages => {
      res.json(languages);
    })
})


app.get('/', (req, res) => res.send('Hello World!'));
const port = 3000;
app.listen(port, () => console.log(`Vocapp server listening on port ${port}!`));