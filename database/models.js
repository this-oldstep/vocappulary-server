const { 
  Collection, 
  CollectionItem, 
  User, 
  Language, 
  Word, 
  Lesson, 
  Translation,
} = require("./config")

Language.create({
  name: "english",
  flag_url: "merica.com",
  active: 1,
})
  .then(() =>{
    return Language.create({
      name: "spanish",
      flag_url: "same.com",
      active: 1,
    })
  })
  .then(() => {
    Language.findAll({})
      .then(all => {
        return all;
      })
  })


/**
 * 
 * @param {array} imageWordList - a list of english strings to be put or retrieved from the database.
 * @param {string} nativeLanguage - native language
 * @param {string} targetLanguage - language being practiced
 * @returns {object} - object that has complete requested words 
 */
const checkWords = (imageWordList, nativeLanguage, targetLanguage) => {
  let words = {
    completeWords: [],
    incompleteWords: [],
  }
  // finds english language id
  return Language.findOne({where: {name: "english"}})
    .then(englishRow => {
      return englishRow
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