const axios = require('axios');


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


module.exports = {
  googleTranslate,
}