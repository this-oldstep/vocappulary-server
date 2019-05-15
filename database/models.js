const { Op } = require('sequelize');
const { 
  Collection, 
  CollectionItem, 
  User, 
  Language, 
  Word,
  Translation,
  Buddies,
  Request,
  Message,
} = require("./config");
const { googleTranslate, googleTextToSpeech } = require('../apiHelpers');




const findOrCreateTranslations = (collectionItemId, getAudio = false) => {
  
  return CollectionItem.findOne({
    where: {
      id: collectionItemId,
    },
  })
    
    
    .then(collectionItemRow => {
      collectionItemRow
      return Promise.all([collectionItemRow.getCollection(), collectionItemRow]);
    })
    
    
    .then(([collectionRow, collectionItemRow]) => {
      return Promise.all([collectionRow.getUser(), collectionItemRow]);
    })


    .then(([userRow, collectionItemRow]) => {
      // gets rows in the follwing order: collectionItem, native language, current language, english language
      return Promise.all([

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
              name: "english",
            },
          })
            .then(englishRow => {
              res(englishRow);
            })
            .catch(err => {
              rej(err);
            })
        }),

        collectionItemRow,

      ]);
    })


    .then(([nativeLanguageRow, currentLanguageRow, englishLanguageRow, collectionItemRow]) => {

      return Promise.all([

        new Promise((res, rej) => {
          Translation.findOne({
            where: {
              wordId: collectionItemRow.wordId,
              languageId: nativeLanguageRow.id,
            },
          })

            .then(transation => {
              if(transation) {
                res(transation)
              } else {
                Translation.findOne({
                  where: {
                    wordId: collectionItemRow.wordId,
                    languageId: englishLanguageRow.id,
                  },
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
            },
          })
          
            .then(transation => {
              if(transation) {
                res(transation)
              } else {
                Translation.findOne({
                  where: {
                    wordId: collectionItemRow.wordId,
                    languageId: englishLanguageRow.id,
                  },
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

        currentLanguageRow, 
        
        collectionItemRow,
      
      ])
    })


    .then(([nativeTranslationRow, currentTranslationRow, currentLanguageRow, collectionItemRow]) => {
      return Promise.all([
        new Promise((res, rej) => {
          if(currentTranslationRow.audio_url || !getAudio || !currentLanguageRow.transTTS) {
            res(currentTranslationRow)
          } else {
            googleTextToSpeech(currentTranslationRow.text, currentLanguageRow.lang_code)
              
              .then(currentAudioUrl => {
                return currentTranslationRow.update({
                  audio_url: currentAudioUrl,
                }, {
                  fields: ['audio_url'],
                })
              })
              
              .then(currentTranslationRow => {
                res(currentTranslationRow);
              })
              .catch(err => {
                rej(err);
              })
          }
        }),
        nativeTranslationRow,
        collectionItemRow,
      ])
    })


    .then(([currentTranslationRow, nativeTranslationRow, collectionItemRow]) => {
      return {
        itemId: collectionItemRow.id,
        url_image: collectionItemRow.image_url,
        currentTranslation: currentTranslationRow.text,
        nativeTranslation: nativeTranslationRow.text,
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
                },
                ),
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
                }),
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
    collectionId,
    wordId,
    image_url: imgUrl,
  })
};



/**
 * gets the collection items of a specific collection.
 * @param {number} collectionId
 * @returns - returns an object with the collection item ids, image urls, active language, and native language 
 */
const getAllCollectionItems = (collectionId) => {
  return Collection.findOne({
    where: {
      id: collectionId,
    },
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
        }),
      ))
    })
};



/**
 * 
 * @param {number} wordId 
 * @param {string} language 
 * @returns - a promise with the language row.
 */
const getTranslation = (wordId, language) => {
  return Language.findOne({where: {lang_code: language}})
    .then(langRow => 
      Translation.findOne({where: {wordId, languageId: langRow.id}}),
    )
};



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
        defaults: {wordId, text: translation, languageId: langCol.id},
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
};



const deleteCollection = (name, userId)=>{
  return Collection.destroy({
    where:{
      name,
      userId,
    },
  })
};



const getAllCollectionItemsForUser = (userId) => {
  return Collection.findAll({
    where: {
      userId,
    },
  })
    .then(collectionRows => {
      return Promise.all(
        collectionRows.map(collectionRow => 
          new Promise((res, rej) => {
            collectionRow.getCollection_items()
              .then(collectionItemRows => {
                res(collectionItemRows);
              })
              .catch(err => {
                rej(err);
              })
          }),
        ),
      )
    })
    .then(unflattenedUserCollectionItems => {
      return Promise.all(
        unflattenedUserCollectionItems.reduce((seed, array) => {
          return seed.concat(array);
        }, []).map(userCollectionItem => 
          new Promise((res, rej) => {
            findOrCreateTranslations(userCollectionItem.id, true)
              .then(userCollectionItemRow => {
                res(userCollectionItemRow);
              })
              .catch(err => {
                rej(err);
              })
          }),
        ),
      )
    })
};



/**
 * gets all collections by userId
 * @param {number} userId
 * @returns - object containing the collection rows
 */
const getAllCollections = userId => 
  Collection.findAll({where: {userId}});



/**
 * @returns all language rows
 */
const getAllLanguages = () => Language.findAll();



const getLanguageById = (languageId) => {
  return Language.findOne({
    where: {
      userId: languageId,
    },
  })
};



const makeUser = (username, email, currentLanguageId, nativeLanguageId, points, firebase) => User.create({
  username, email, currentLanguageId, nativeLanguageId, points, firebase,
});

//made this for jest testing
const deleteUser = (username, email) => {
  User.destroy({
    where: {
      username,
      email,
    },
  });
}


const findUser = (email, firebase) => User.findOne({
  where: {
    email,
    firebase,
  },
});

const verifyUser = (id, firebase) => User.findOne({
  where: {
    id,
    firebase,
  },
});


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
    },
  })
    .then(userRow => {
      return userRow.update(updateObj, {fields});
    })
};



const getBuddies = (userId) => {
  return User.findOne({
    where: {
      id: userId,
    },
  })
    .then(userRow => {
      return Promise.all([
        userRow.getBuddy1s(),
        userRow.getBuddy2s(),
      ])
    })
    .then(([buddySet1, buddySet2]) => {
      return buddySet1.concat(buddySet2).map(buddyRow => ({
        id: buddyRow.id,
        username: buddyRow.username,
        nativeLanguageId: buddyRow.nativeLanguageId,
        currentLanguageId: buddyRow.currentLanguageId,
      }));
    })
};



const getRequests = (userId) => {
  return User.findOne({
    where: {
      id: userId,
    },
  })
    .then(userRow => {
      return userRow.getPotentialBuddies()
    })
    .then(potentialBuddyRows => {
      return potentialBuddyRows.map(potentialBuddyRow => ({
        id: potentialBuddyRow.id,
        username: potentialBuddyRow.username,
        nativeLanguageId: potentialBuddyRow.nativeLanguageId,
        currentLanguageId: potentialBuddyRow.currentLanguageId,
      }))
    })
}



const sendRequest = (userId, potentialBuddyId) => {
  return Request.create({
    requesterId: userId,
    potentialBuddyId,
  })
};



const acceptBuddyRequest = (userId, newBuddyId) => {
  return Request.findOne({
    where: {
      potentialBuddyId: userId,
      requesterId: newBuddyId,
    },
  })
    .then(requestRow => {
      requestRow.destroy();
      return Buddies.create({
        buddy1Id: requestRow.requesterId,
        buddy2Id: requestRow.potentialBuddyId,
      })
    })
};



const rejectBuddyRequest = (userId, rejectedBuddyId) => {
  return Request.findOne({
    where: {
      potentialBuddyId: userId,
      requesterId: rejectedBuddyId,
    },
  })
    .then(requestRow => {
      return requestRow.destroy();
    })

};



const getPotentialBuddies = (userId) => {
  return Request.findAll({
    where: {
      [Op.or]: {
        potentialBuddyId: userId,
        requesterId: userId,
      },
    },
  })


    .then(userRequestRows => {
      return Promise.all([
        Buddies.findAll({
          where: {
            [Op.or]: [{buddy1Id: userId}, {buddy2Id: userId}],
          },
        }),
        userRequestRows,
      ])
    })


    .then(([buddiesRows, userRequestRows]) => {
      return User.findAll({
        where: {
          id: {
            [Op.not]: buddiesRows.reduce((seed, buddyRow) => {
              return seed.concat([buddyRow.buddy1Id, buddyRow.buddy2Id]);
            }, [])
              .concat(userRequestRows.reduce((seed, userRequestRow) => {
                return seed.concat([userRequestRow.potentialBuddyId, userRequestRow.requesterId]);
              }, [])),
          },
        },
      })


        .then(userRows => {
          return Promise.all(
            userRows.map(userRow => {
              return new Promise((resOuter, rej) => {
                Promise.all([
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
                        res(currentLanguageRow)
                      })
                      .catch(err => {
                        rej(err);
                      })
                  }),

                ])


                  .then(([nativeLanguage, currentLanguage]) => {
                    resOuter({
                      id: userRow.id,
                      username: userRow.username,
                      nativeLanguage,
                      currentLanguage,
                    })
                  })


                  .catch(err => {
                    rej(err);
                  });
              });
            }),
          );
        })
      
      
        .then(userRows => {
          return userRows.filter(userRow => userRow.id !== userId);
        });
    });
};



const getMessages = (userId, buddyId) => {
  return Promise.all([
    Message.findAll({
      where: {
        senderId: userId, 
        receiverId: buddyId,
      },
    }),
    Message.findAll({
      where: {
        senderId: buddyId,
        receiverId: userId,
      },
    }),
  ])
    .then(([userMessages, buddyMessages]) => {
      return userMessages.concat(buddyMessages).sort((a, b) => {
        return a.createdAt.getTime() > b.createdAt.getTime() ? 1 : -1;
      })
    })
};




const addMessage = (userId, buddyId, text) => {
  return Message.create({
    senderId: userId,
    receiverId: buddyId,
    text,
  });
};



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
  verifyUser,
  deleteUser,
  deleteCollection,
  findOrCreateTranslations,
  getAllCollectionItemsForUser,
  editUser,
  getLanguageById,
  getBuddies,
  getRequests,
  sendRequest,
  acceptBuddyRequest,
  rejectBuddyRequest,
  getPotentialBuddies,
  getMessages,
  addMessage,
};