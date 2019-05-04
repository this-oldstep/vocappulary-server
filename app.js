require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('./database/config.js')
const { checkWords } = require("./database/models")
// adds moch data
// require("./mochData/moch")()


app.use(bodyParser.json({ type: 'application/json'}));

///////////////
/// Routes ////
///////////////


const images = require('./routes/images');
const textToSpeech = require('./routes/text-to-speech.js');
<<<<<<< HEAD
const collections = require('./routes/collections');
=======

>>>>>>> cd81866f15ae4090c8622b77e5340827f59626b7

///////////////

app.use('/images', images);
app.use('/texttospeech', textToSpeech);
app.use('/collections', collections);


///////////////


app.get('/', (req, res) => res.send('Hello World!'));
const port = 3000;
app.listen(port, () => console.log(`Vocapp server listening on port ${port}!`));