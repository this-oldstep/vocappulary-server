const { 
  Collection, 
  CollectionItem, 
  User, 
  Language, 
  Word, 
  Lesson, 
  Translation,
} = require("./config");

const { googleTranslate, googleTextToSpeech } = require('../apiHelpers');


const findOrCreateTranslations = (collectionItemId, getAudio = false) => {
  const persistingObj = {};
    return CollectionItem.findOne({
      where: {
        id: collectionItemId,
      }
    })
    
    
    .then(collectionItemRow => {
      persistingObj.collectionItemRow = collectionItemRow
      return collectionItemRow.getCollection()
    })
    
    
    .then(collectionRow => {
      return collectionRow.getUser();
    })


    .then(userRow => {
      persistingObj.userRow = userRow;
      // gets rows in the follwing order: collectionItem, native language, current language, english language
      const promisesArr = [

        new Promise((res, rej) => {
          userRow.getNative_language()
            .then(nativeLanguageRow => {
              res(nativeLanguageRow);
            })
            .catch(err => {
              rej(err);
            })
        }),

        new Promise((res, rej) => {
          userRow.getCurrent_language()
            .then(currentLanguageRow => {
              res(currentLanguageRow);
            })
            .catch(err => {
              rej(err);
            })
        }),

        new Promise((res, rej) => {
          Language.findOne({
            where: {
              name: "english"
            }
          })
            .then(englishRow => {
              res(englishRow);
            })
            .catch(err => {
              rej(err);
            })
        }),

      ];
      return Promise.all(promisesArr);
    })


    .then(promisesReturn => {
      collectionItemRow = persistingObj.collectionItemRow
      persistingObj.nativeLanguageRow = nativeLanguageRow = promisesReturn[0];
      persistingObj.currentLanguageRow = currentLanguageRow = promisesReturn[1];
      persistingObj.englishLanguageRow = englishLanguageRow = promisesReturn[2];

      const translationPromisesArr = [

        new Promise((res, rej) => {
          Translation.findOne({
            where: {
              wordId: collectionItemRow.wordId,
              languageId: nativeLanguageRow.id,
            }
          })

          .then(transation => {
          if(transation) {
            res(transation)
          } else {
            Translation.findOne({
              where: {
                wordId: collectionItemRow.wordId,
                languageId: englishLanguageRow.id,
              }
            })
          
            .then(englishTranslationRow => {
              return googleTranslate(englishTranslationRow.text, "en", nativeLanguageRow.lang_code);
            })
          
            .then(nativeLanguageText => {
              return Translation.create({
                text: nativeLanguageText,
                languageId: nativeLanguageRow.id,
                wordId: collectionItemRow.wordId,
              })
            })
          
            .then(transation => {
              res(transation)
            })
          }
          })
          .catch(err => {
            rej(err);
          })
        }),

        new Promise((res, rej) => {
          Translation.findOne({
            where: {
              wordId: collectionItemRow.wordId,
              languageId: currentLanguageRow.id,
            }
          })
          
          .then(transation => {
            if(transation) {
              res(transation)
            } else {
              Translation.findOne({
                where: {
                  wordId: collectionItemRow.wordId,
                  languageId: englishLanguageRow.id,
                }
              })
          
              .then(englishTranslationRow => {
                return googleTranslate(englishTranslationRow.text, "en", currentLanguageRow.lang_code);
              })
          
              .then(currentLanguageText => {
                return Translation.create({
                  text: currentLanguageText,
                  languageId: currentLanguageRow.id,
                  wordId: collectionItemRow.wordId,
                })
              })
          
              .then(transation => {
                res(transation)
              })
            }
            })
            .catch(err => {
              rej(err);
            })
        }),
      ]

      return Promise.all(translationPromisesArr);
    })
    .then(nativeAndCurrentTranslationRow => {
      persistingObj.nativeTranslationRow = nativeAndCurrentTranslationRow[0];
      const currentTranslationRow = nativeAndCurrentTranslationRow[1];
      const currentAudioPromise = 
        new Promise((res, rej) => {
          if(currentTranslationRow.audio_url || !getAudio) {
            res(currentTranslationRow)
          } else {
            googleTextToSpeech(currentTranslationRow.text, persistingObj.currentLanguageRow.lang_code)
              
              .then(currentAudioUrl => {
                return currentTranslationRow.update({
                  audio_url: currentAudioUrl,
                }, {
                  fields: ['audio_url']
                })
              })
              
              .then(currentTranslationRow => {
                res(currentTranslationRow);
              })
              .catch(err => {
                rej(err);
              })
          }
        })
      return Promise.resolve(currentAudioPromise)
    })


    .then(currentTranslationRow => {
      return {
        itemId: persistingObj.collectionItemRow.id,
        url_image: persistingObj.collectionItemRow.image_url,
        currentTranslation: currentTranslationRow.text,
        nativeTranslation: persistingObj.nativeTranslationRow.text,
        currentAudioUrl: currentTranslationRow.audio_url,
      }
    })
};



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
  return Collection.findOne({
    where: {
      id: collectionId,
    }
  })
    .then(collectionRow => {
      return collectionRow.getCollection_items();
    })
    .then(collectionItems => {
      return Promise.all(collectionItems.map(item => 
        new Promise((res, rej) => {
          findOrCreateTranslations(item.id, true)
          .then(returnItem => {
            res(returnItem);
          })
        })
      ))
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



/**
 * Adds translation of word if possible, adds a count to the collection count, and creates a new collection item
 * @param {number} collectionId 
 * @param {string} image_url 
 * @param {number} wordId 
 * @returns an object with image_url and currentLangText. The currentLangText is the language of the text they are learning.
 */
const makeNewCollectionItem = (collectionId, image_url, wordId) => {
  return CollectionItem.create({
    collectionId,
    image_url,
    wordId,
  })
  .then(collectionItemRow => {
    return findOrCreateTranslations(collectionItemRow.id, true);
  })
}



/**
 * makes a collection
 * @param {number} userId 
 * @param {string} name 
 * @param {boolean} isPublic - optional
 * @returns collection row
 */
const createCollection = (userId, name, isPublic = false) => {
  return Collection.create({
    name,
    is_public: isPublic,
    count: 0,
    userId,
  })
}

const deleteCollection = (name, userId)=>{
  return Collection.destroy({
    where:{
      name: name,
      userId: userId
    }
  })
}



const getAllCollectionItemsForUser = (userId) => {
  return Collection.findAll({
    where: {
      userId,
    }
  })
    .then(collectionRows => {
      const collectionItemPromises = collectionRows.map(collectionRow => 
        new Promise((res, rej) => {
          // findOrCreateTranslations(collectionRow.id)
          collectionRow.getCollection_items()
            .then(collectionItemRows => {
              res(collectionItemRows);
            })
            .catch(err => {
              rej(err);
            })
        })
      )

      return Promise.all(collectionItemPromises)
    })
    .then(unflattenedUserCollectionItems => {
      const userCollectionItemPromises = unflattenedUserCollectionItems.reduce((seed, array) => {
        return seed.concat(array);
      }, []).map(userCollectionItem => 
        new Promise((res, rej) => {
          findOrCreateTranslations(userCollectionItem.id)
            .then(userCollectionItemRow => {
              res(userCollectionItemRow);
            })
            .catch(err => {
              rej(err);
            })
        })
      )
      return Promise.all(userCollectionItemPromises)
    })
}



/**
 * gets all collections by userId
 * @param {number} userId
 * @returns - object containing the collection rows
 */
const getAllCollections = userId => 
  Collection.findAll({where: {userId}})



/**
 * @returns all language rows
 */
const getAllLanguages = () => Language.findAll();



const makeUser = (username, email, currentLanguageId, nativeLanguageId, points) => 
  User.create({username, email, currentLanguageId, nativeLanguageId, points})

//made this for jest testing
const deleteUser = (username, email)=>{
    User.destroy({
      where:{
        username: username,
        email: email,
      }
    })
  }


const findUser = (email) => 
  User.findOne({where: {email}})


const editUser = (userId, currentLanguageId, nativeLanguageId, email) => {
  const fields = [];
  const updateObj = {};
  if(currentLanguageId) {
    fields.push("currentLanguageId")
    updateObj.currentLanguageId = currentLanguageId;
  }
  if(nativeLanguageId) {
    fields.push("nativeLanguageId")
    updateObj.nativeLanguageId = nativeLanguageId;
  }
  if(email) {
    fields.push("email")
    updateObj.email = email;
  }
  return User.findOne({
    where: {
      id: userId,
    }
  })
    .then(userRow => {
      return userRow.update(updateObj, {fields});
    })
}


module.exports.db = {
  checkWords,
  getTranslation,
  addTranslationToWord,
  getAllCollectionItems,
  makeNewCollectionItem,
  selectWord,
  createCollection,
  getAllCollections,
  getAllLanguages,
  makeUser,
  findUser,
  deleteUser,
  deleteCollection,
  findOrCreateTranslations,
  getAllCollectionItemsForUser,
  editUser
};