const { 
  Collection, 
  CollectionItem, 
  User, 
  Language, 
  Word, 
  Lesson, 
  Translation,
} = require("./config")



/**
 * 
 * @param {array} imageWordList - a list of english strings to be put or retrieved from the database.
 * @param {string} nativeLanguage - native language
 * @param {string} targetLanguage - language being practiced
 * @returns {object} - object that has complete requested words 
 */
const checkWords = (imageWordList, nativeLanguage) => {
  let words = {
    completeWords: [],
    incompleteWords: [],
  }
  // makes an array of promises to find the relavant word columns
  const searchWordPromises = imageWordList.map(engWord => new Promise((res, rej) => {
    Word.findOne({where: {eng_word: engWord}})
      .then(col => {
        res(col);
      })
  }));
  return Promise.all(searchWordPromises)
    .then(wordCols => {
      return wordCols;
    })
};
checkWords([
  "dog",
  "shepherd",
  "canine",
  "german shepherd",
  "mammal"
], "english", "spanish");

module.exports = {
  checkWords,
};