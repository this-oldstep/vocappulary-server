const { 
  Collection, 
  CollectionItem, 
  User, 
  Language, 
  Word, 
  Lesson, 
  Translation,
} = require("./config");

const { googleTranslate } = require('../apiHelpers');



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
  return Language.findOne({where: {lang_code: "en"}})
    .then(engRow => {
      return Promise.all(searchWordPromises)
        .then(wordCols => {
          const nonExistantWordsPromises = [];
          // adds words that exist in the database to the wordCols array.
          wordCols = wordCols.filter((word, index) => {
            if(!word) {
              // if the word doesn't exist in the database it creates a row for it in the word table and an english translation.
              nonExistantWordsPromises.push(
                new Promise((res, rej) => {
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
                  }
                )
              )
              return false;
            }
            return true;
          });
          // runs the array of promises to create words in the database
          return Promise.all(nonExistantWordsPromises)
            .then(newWordCols => {
              // pulls together the list of newly created words and old words.
              const allWordCols = wordCols.concat(newWordCols);
              // makes an array of promises to get all the translations
              const getTranslationPromises = allWordCols.map(word => 
                new Promise((res, rej) => {
                  // gets the language cols from the language tables for all existing languages of the word
                  word.getWord()
                    .then(language => res(language))
                })
              );
              return Promise.all(getTranslationPromises)
                .then(language => {
                  // gets the code of the native language to see if the word has that language
                  return Language.findOne({where: {lang_code: nativeLanguage}})
                    .then(nativeLanguage => {
                      // gets all words with a translation of the native language
                      words.completeWords = allWordCols.filter((word, index) => {
                        let hasNative = false;
                        language[index].forEach(lang => {
                          if(lang.id === nativeLanguage.id) {
                            hasNative = true;
                          }
                        })
                        return hasNative;
                      });
                      // gets all words without a translation of the native language
                      words.incompleteWords = allWordCols.filter((word, index) => {
                        let hasNative = false;
                        language[index].forEach(lang => {
                          if(lang.id === nativeLanguage.id) {
                            hasNative = true;
                          }
                        })
                        return !hasNative;
                      });
                      // object returned by the function.
                      return words;
                    });
                });
            });
        });
    });
};

const selectWord = function(wordId, collectionId, imgUrl){
  return CollectionItem.create({
    collectionId: collectionId,
    wordId: wordId,
    image_url: imgUrl,
  })
}

/**
 * gets the collection items of a specific collection.
 * @param {number} collectionId
 * @returns - returns an object with the collection item ids, image urls, active language, and native language 
 */
const getAllCollectionItems = (collectionId) => {
  const collectionObject = {}
  return Collection.findOne({where: {id: collectionId}})
    .then(collectionCol => {
      collectionObject.collectionCol = collectionCol;
      return collectionCol.getUser();
    })
    .then(user => {
      collectionObject.user = user;
      return collectionObject.collectionCol.getCollection_items();
    })
    .then(collectionItems => {
      collectionObject.collectionItems = collectionItems;
      const translationPromises = collectionItems.map(item => 
        new Promise((res, rej) => {
          item.getWord()
            .then(word => 
              Translation.findOne({
                where: {
                  wordId: word.id,
                  languageId: collectionObject.user.nativeLanguageId,
                }
              })
            )
            .then(transations => {
              res(transations)
            })
        })
      )
      return Promise.all(translationPromises)
    })
    .then(nativeTranslations => {
      collectionObject.nativeTranslations = nativeTranslations;
      const getWordPromises = collectionObject.collectionItems.map(item =>
        new Promise((res, rej) => {
          item.getWord()
            .then(word => 
              Translation.findOne({
                where: {
                  wordId: word.id,
                  languageId: collectionObject.user.currentLanguageId,
                }
              })
            )
            .then(transations => {
              res(transations);
            })
        })
      )
      return Promise.all(getWordPromises);
    })
    .then(currentTranslations => {
      collectionObject.currentTranslations = currentTranslations;
      return currentTranslations.map((currentTranslation, index) => ({
        itemId: collectionObject.collectionItems[index].id,
        url_image: collectionObject.collectionItems[index].image_url,
        currentTranslation: currentTranslation.text,
        nativeTranslation: collectionObject.nativeTranslations[index].text,
      }))
    })
}


/**
 * 
 * @param {number} wordId 
 * @param {string} language 
 * @returns - a promise with the language row.
 */
const getTranslation = (wordId, language) => {
  return Language.findOne({where: {lang_code: language}})
    .then(langRow => 
      Translation.findOne({where: {wordId, languageId: langRow.id}})
    )
}


/**
 * adds a trnastlation to a word
 * @param {number} wordId 
 * @param {string} language - lang_code
 * @param {string} translation
 * @returns - promise with new translation row 
 */
const addTranslationToWord = (wordId, language, translation) => {
  // finds the relavant language
  return Language.findOne({where: {lang_code: language}})
    .then(langCol => {
      // finds or creates the relavant language
      return Translation.findOrCreate({
        where: {wordId, languageId: langCol.id},
        defaults: {wordId, text: translation, languageId: langCol.id}
      })
    })
    .then(translatedCol => {
      // returns only the translated column
      return translatedCol[0];
    })
    .catch(err => {
      console.error(err);
    })
};



const makeNewCollectionItem = (collectionId, image_url, wordId) => {
  const collectionItemObj = {};
  return Collection.findOne({id: collectionId})
    .then(collectionCol => {
      collectionItemObj.collectionCol = collectionCol;
      return collectionCol.getUser()
    })
    .then(userCol => {
      return userCol.getCurrent_language()
    })
    .then(currentLanguageRow => {
      collectionItemObj.currentLanguageRow = currentLanguageRow;
      return Language.findOne({
        where: {
          name: "english",
        }
      })
    })
    .then(englishRow => {
      collectionItemObj.englishRow = englishRow
      return Translation.findOne({
        where: {
          wordId,
          languageId: englishRow.id
        }
      })
    })
    .then(engTranslation => {
      return googleTranslate(engTranslation.text, collectionItemObj.englishRow.lang_code, collectionItemObj.currentLanguageRow.lang_code)
    })
    .then(translatedText => {
      return Translation.create({
        text: translatedText,
        wordId,
        languageId: collectionItemObj.currentLanguageRow.id,
      })
    })
    .then(translatedRow => {
      collectionItemObj.translatedRow = translatedRow;
      return CollectionItem.create({
        image_url,
        wordId,
        collectionId,
      })
    })
    .then(collectionItemRow => {
      return {
        image_url,
        currentLangText: collectionItemObj.translatedRow.text,
      }
    })
    .catch(err => {
      console.error(err);
    })
};



const createCollection = (userId, name, public = false) => {
  return Collection.create({
    name,
    public,
    count: 0,
    userId,
  })
}


const getAllCollections = userId => Collection.findAll({where: {userId}})


module.exports.db = {
  checkWords,
  getTranslation,
  addTranslationToWord,
  getAllCollectionItems,
  makeNewCollectionItem,
  selectWord,
  createCollection,
  getAllCollections,
};