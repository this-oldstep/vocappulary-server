const { 
  Collection, 
  CollectionItem, 
  User, 
  Language, 
  Word, 
  Lesson, 
  Translation,
} = require("./config");



/**
 * takes a lits of words and checks the database for them. If they don't exist it makes an english version of them. 
 * Then it returns an object containing the rows of the words in the database in two arrays. One for words with the 
 * native language, one for the words without it.
 * @param {array} imageWordList - a list of english strings to be put or retrieved from the database.
 * @param {string} nativeLanguage - native language
 * @returns {object} - object that has complete requested words has two arrays: completeWords, and incompleteWords. 
 * Both contain the columns for the words in the word table 
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
  return Language.findOne({where: {name: "english"}})
    .then(engRow => {
      return Promise.all(searchWordPromises)
        .then(wordCols => {
          const nonExistantWordsPromises = [];
          wordCols = wordCols.filter((word, index) => {
            if(!word) {
              nonExistantWordsPromises.push(new Promise((res, rej) => {
                Word.create({eng_word: imageWordList[index]})
                  .then(wordCol => {
                    Translation.create({
                      text: wordCol.eng_word,
                      wordId: wordCol.id,
                      languageId: engRow.id,
                    })
                    .then(() => {
                      res(wordCol)
                    })
                  })
              }))
              return false;
            }
            return true;
          });
          return Promise.all(nonExistantWordsPromises)
            .then(newWordCols => {
              const allWordCols = wordCols.concat(newWordCols);
              // makes an array of promises to get all the translations
              const getTranslationPromises = allWordCols.map(word => new Promise((res, rej) => {
                word.getWord()
                  .then(language => res(language))
              }));
              return Promise.all(getTranslationPromises)
                .then(language => {
                  return Language.findOne({where: {name: nativeLanguage}})
                    .then(nativeLanguage => {
                      words.completeWords = allWordCols.filter((word, index) => {
                        let hasNative = false;
                        language[index].forEach(lang => {
                          if(lang.id === nativeLanguage.id) {
                            hasNative = true;
                          }
                        })
                        return hasNative;
                      });
                      words.incompleteWords = allWordCols.filter((word, index) => {
                        let hasNative = false;
                        language[index].forEach(lang => {
                          if(lang.id === nativeLanguage.id) {
                            hasNative = true;
                          }
                        })
                        return !hasNative;
                      });
                      return words;
                    });
                });
            });
        });
    });
};


/**
 * 
 * @param {number} wordId 
 * @param {string} language 
 * @returns - a promise with the language row.
 */
const getTranslation = (wordId, language) => {
  return Language.findOne({where: {name: language}})
    .then(langRow => 
      Translation.findOne({where: {wordId, languageId: langRow.id}})
    )
}


/**
 * adds a trnastlation to a word
 * @param {number} wordId 
 * @param {string} language - string of target language
 * @param {string} translation
 * @returns - promise with new translation row 
 */
const addTranslationToWord = (wordId, language, translation) => {
  return Language.findOne({where: {name: language}})
    .then(langCol => {
      return Translation.findOrCreate({
        where: {wordId, text: translation},
        defaults: {wordId, text: translation, languageId: langCol.id}
      })
    })
};

module.exports.db = {
  checkWords,
  getTranslation,
  addTranslationToWord,
};