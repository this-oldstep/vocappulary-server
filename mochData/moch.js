const { Word, Language, Translation, Collection, CollectionItem, Lesson, User } = require("../database/config");

const clarifaiObj = {
  "status": {
      "code": 10000,
      "description": "Ok",
      "req_id": "596bea5a8aed412592e73c778e5352df"
  },
  "outputs": [
      {
          "id": "f3cfa661eb004331a47b21ca356fe8f0",
          "status": {
              "code": 10000,
              "description": "Ok"
          },
          "created_at": "2019-05-03T02:27:11.433433836Z",
          "model": {
              "id": "aaa03c23b3724a16a56b629203edc62c",
              "name": "general",
              "created_at": "2016-03-09T17:11:39.608845Z",
              "app_id": "main",
              "output_info": {
                  "message": "Show output_info with: GET /models/{model_id}/output_info",
                  "type": "concept",
                  "type_ext": "concept"
              },
              "model_version": {
                  "id": "aa9ca48295b37401f8af92ad1af0d91d",
                  "created_at": "2016-07-13T01:19:12.147644Z",
                  "status": {
                      "code": 21100,
                      "description": "Model trained successfully"
                  }
              },
              "display_name": "General"
          },
          "input": {
              "id": "1029d25a8367411f9f649c88957e1174",
              "data": {
                  "image": {
                      "url": "https://cdn3-www.dogtime.com/assets/uploads/gallery/german-shepherd-dog-breed-pictures/standing-7.jpg"
                  }
              }
          },
          "data": {
              "concepts": [
                  {
                      "id": "ai_8S2Vq3cR",
                      "name": "dog",
                      "value": 0.99819744,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_XTKwRBCb",
                      "name": "shepherd",
                      "value": 0.9914368,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_M6pVRDsX",
                      "name": "canine",
                      "value": 0.99130166,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_786Zr311",
                      "name": "no person",
                      "value": 0.98840773,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_JSWCZjfv",
                      "name": "german shepherd",
                      "value": 0.9864209,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_N6BnC4br",
                      "name": "mammal",
                      "value": 0.9857063,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_qKZdRzT1",
                      "name": "sheepdog",
                      "value": 0.9813617,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_Zmhsv0Ch",
                      "name": "outdoors",
                      "value": 0.9749954,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_gPNNX7LT",
                      "name": "pet",
                      "value": 0.9687774,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_SzsXMB1w",
                      "name": "animal",
                      "value": 0.96598375,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_TJ9wFfK5",
                      "name": "portrait",
                      "value": 0.9598955,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_SVshtN54",
                      "name": "one",
                      "value": 0.9585037,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_9fQBzNBM",
                      "name": "looking",
                      "value": 0.95424545,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_wqgGDjK4",
                      "name": "fur",
                      "value": 0.95034564,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_4CRlSvbV",
                      "name": "cute",
                      "value": 0.9437475,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_HFj2M4WJ",
                      "name": "herdsman",
                      "value": 0.9432012,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_mp9KG5QH",
                      "name": "grass",
                      "value": 0.937538,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_ZHrvzqvV",
                      "name": "guard",
                      "value": 0.92524385,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_TRDpDWw1",
                      "name": "loyalty",
                      "value": 0.8953154,
                      "app_id": "main"
                  },
                  {
                      "id": "ai_tBcWlsCp",
                      "name": "nature",
                      "value": 0.88833296,
                      "app_id": "main"
                  }
              ]
          }
      }
  ],
  "rawData": {
      "status": {
          "code": 10000,
          "description": "Ok",
          "req_id": "596bea5a8aed412592e73c778e5352df"
      },
      "outputs": [
          {
              "id": "f3cfa661eb004331a47b21ca356fe8f0",
              "status": {
                  "code": 10000,
                  "description": "Ok"
              },
              "created_at": "2019-05-03T02:27:11.433433836Z",
              "model": {
                  "id": "aaa03c23b3724a16a56b629203edc62c",
                  "name": "general",
                  "created_at": "2016-03-09T17:11:39.608845Z",
                  "app_id": "main",
                  "output_info": {
                      "message": "Show output_info with: GET /models/{model_id}/output_info",
                      "type": "concept",
                      "type_ext": "concept"
                  },
                  "model_version": {
                      "id": "aa9ca48295b37401f8af92ad1af0d91d",
                      "created_at": "2016-07-13T01:19:12.147644Z",
                      "status": {
                          "code": 21100,
                          "description": "Model trained successfully"
                      }
                  },
                  "display_name": "General"
              },
              "input": {
                  "id": "1029d25a8367411f9f649c88957e1174",
                  "data": {
                      "image": {
                          "url": "https://cdn3-www.dogtime.com/assets/uploads/gallery/german-shepherd-dog-breed-pictures/standing-7.jpg"
                      }
                  }
              },
              "data": {
                  "concepts": [
                      {
                          "id": "ai_8S2Vq3cR",
                          "name": "dog",
                          "value": 0.99819744,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_XTKwRBCb",
                          "name": "shepherd",
                          "value": 0.9914368,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_M6pVRDsX",
                          "name": "canine",
                          "value": 0.99130166,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_786Zr311",
                          "name": "no person",
                          "value": 0.98840773,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_JSWCZjfv",
                          "name": "german shepherd",
                          "value": 0.9864209,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_N6BnC4br",
                          "name": "mammal",
                          "value": 0.9857063,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_qKZdRzT1",
                          "name": "sheepdog",
                          "value": 0.9813617,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_Zmhsv0Ch",
                          "name": "outdoors",
                          "value": 0.9749954,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_gPNNX7LT",
                          "name": "pet",
                          "value": 0.9687774,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_SzsXMB1w",
                          "name": "animal",
                          "value": 0.96598375,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_TJ9wFfK5",
                          "name": "portrait",
                          "value": 0.9598955,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_SVshtN54",
                          "name": "one",
                          "value": 0.9585037,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_9fQBzNBM",
                          "name": "looking",
                          "value": 0.95424545,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_wqgGDjK4",
                          "name": "fur",
                          "value": 0.95034564,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_4CRlSvbV",
                          "name": "cute",
                          "value": 0.9437475,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_HFj2M4WJ",
                          "name": "herdsman",
                          "value": 0.9432012,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_mp9KG5QH",
                          "name": "grass",
                          "value": 0.937538,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_ZHrvzqvV",
                          "name": "guard",
                          "value": 0.92524385,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_TRDpDWw1",
                          "name": "loyalty",
                          "value": 0.8953154,
                          "app_id": "main"
                      },
                      {
                          "id": "ai_tBcWlsCp",
                          "name": "nature",
                          "value": 0.88833296,
                          "app_id": "main"
                      }
                  ]
              }
          }
      ]
  }
}

const languages = [
    {
        name: 'english',
        lang_code: 'en',
        flag_url: 'https://lipis.github.io/flag-icon-css/flags/4x3/us.svg',
        active: true,
    },
    {
        name: 'spanish',
        lang_code: 'es',
        flag_url: 'https://lipis.github.io/flag-icon-css/flags/4x3/es.svg',
        active: true,
    },
    {
        name: 'portugese',
        lang_code: 'pt',
        flag_url: 'https://lipis.github.io/flag-icon-css/flags/4x3/pt.svg',
        active: true,
    },
    {
        name: 'italian',
        lang_code: 'it',
        flag_url: 'https://lipis.github.io/flag-icon-css/flags/4x3/it.svg',
        active: true,
    },
    {
        name: 'french',
        lang_code: 'fr',
        flag_url: 'https://lipis.github.io/flag-icon-css/flags/4x3/fr.svg',
        active: true,
    },
    {
        name: 'german',
        lang_code: 'de',
        flag_url: 'https://lipis.github.io/flag-icon-css/flags/4x3/de.svg',
        active: true,
    },
    {
        name: 'danish',
        lang_code: 'da',
        flag_url: 'https://lipis.github.io/flag-icon-css/flags/4x3/dk.svg',
        active: true,
    },
    {
        name: 'swahili',
        lang_code: 'sw',
        flag_url: 'https://lipis.github.io/flag-icon-css/flags/4x3/ug.svg',
        active: true,
    },
    {
        name: 'tagalog',
        lang_code: 'tl',
        flag_url: 'https://lipis.github.io/flag-icon-css/flags/4x3/ph.svg',
        active: true,
    },
    {
        name: 'vietnamesse',
        lang_code: 'vi',
        flag_url: 'https://lipis.github.io/flag-icon-css/flags/4x3/vn.svg',
        active: true,
    },
    {
        name: 'turkish',
        lang_code: 'tr',
        flag_url: 'https://lipis.github.io/flag-icon-css/flags/4x3/tr.svg',
        active: true,
    },
    {
        name: 'basque',
        lang_code: 'eu',
        flag_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Flag_of_the_Basque_Country.svg/2000px-Flag_of_the_Basque_Country.svg.png',
        active: true,
    },
    {
        name: 'zulu',
        lang_code: 'zu',
        flag_url: 'https://lipis.github.io/flag-icon-css/flags/4x3/za.svg',
        active: true,
    },
  ];

const makeLanguages = () => {
    const langPromses = languages.map(lang => new Promise((res, rej) => {
        Language.create(lang)
            .then(rows => res(rows))
    }))
}

const words = [
    "dog",
    "shepherd",
    "canine",
    "german shepherd",
    "mammal",
]

const makeMochWords = (array, language) => {
    const wordPromiseArr = array.map(word => new Promise((res, req) => {
        Word.create({
            eng_word: word,
        })
            .then(wordCols => {res(wordCols)})
    }));
    wordPromiseArr.push(new Promise((res, rej) => {
        Language.findOne({where: {name: language}})
            .then(lang => res(lang));
    }));
    wordPromiseArr.push(new Promise((res, rej) => {
        Language.findOne({where: {name: "english"}})
            .then(lang => res(lang));
    }));
    return Promise.all(wordPromiseArr)
        .then(resProms => {
            const wordsRes = resProms.slice(0, resProms.length - 1);
            const langRes = resProms[resProms.length - 2];
            const engRes = resProms[resProms.length - 1];
            const langWordPromises = wordsRes.map(word => new Promise((res, rej) => {
                    Translation.create({
                        text: word.eng_word + language,
                        wordId: word.id,
                        languageId: langRes.id,
                    })
                        .then(translationCol => {
                            res(translationCol)
                        })
                }
            ));
            const engWordPromises = wordsRes.map(word => new Promise((res, rej) => {
                    Translation.create({
                        text: word.eng_word,
                        wordId: word.id,
                        languageId: engRes.id,
                    })
                    .then(translationCol => {
                        res(translationCol)
                    })
                }
            ));
            return Promise.all(langWordPromises.concat(engWordPromises))
                .then(() => wordsRes.map(word => word.id));
        });
}

const users = [
    {
        username: "john",
        nativeLanguageId: 1,
        currentLanguageId: 2,
    },
    {
        username: "jeff",
        nativeLanguageId: 1,
        currentLanguageId: 2,
    },
    {
        username: "david",
        nativeLanguageId: 1,
        currentLanguageId: 2,
    },
    {
        username: "yeetus",
        nativeLanguageId: 1,
        currentLanguageId: 2,
    },
]

const makeUsers = () => {
    const userPromises = users.map(user => 
        new Promise((res, rej) => {
            User.create(user)
                .then(userCol => {
                    res(userCol)
                })
        })
    )
    return Promise.all(userPromises)
        .then(userCols => {
            return userCols.map(user => user.id);
        })
}

const makeCollection = (userIds) => 
    Promise.all(userIds.map(userId => 
        new Promise((res, rej) => {
            Collection.create({userId})
                .then(userCol => {
                    res(userCol.id)
                })
        })
    ))


const makeCollectionItems = (collectionIds) => {
    const collectionPromises = collectionIds.map(collectionId => new Promise((res, rej) =>{
        makeMochWords(words, "spanish")
            .then(wordIds => {
                const collectionItemPromises = wordIds.map(wordId =>
                    new Promise((res, rej) => {
                        CollectionItem.create({
                            image_url: `word${wordId}.com`,
                            wordId: wordId,
                            collectionId,
                        })
                        .then(collectionItem => {
                            return res(collectionItem)
                        })
                    })
                )
                return Promise.all(collectionItemPromises)
                    .then(collectionItemIds => {
                        return res(collectionItemIds)
                    })
            })
    }))
    return Promise.all(collectionPromises)
}


module.exports = () => {
    makeUsers()
        .then(makeCollection)
        .then(makeCollectionItems)
    // makeLanguages();
    // makeMochWords(words, "spanish");
};