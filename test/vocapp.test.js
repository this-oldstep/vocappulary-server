const { googleTranslate } = require('../apiHelpers.js');
const { db } = require('../database/models.js');

describe('TRANSLATION API TESTS', () => {
  test('english to spanish translation', () => {
    return googleTranslate('father', 'en', 'es')
      .then((res) => {
        expect(res).toBe('padre');
      })
  });

  test('spanish to french translation', () => {
    return googleTranslate('padre', 'es', 'fr')
      .then((res) => {
        expect(res).toBe('père');
      })
  });

  test('portugese to spanish translation', () => {
    return googleTranslate('pai', 'pt', 'es')
      .then((res) => {
        expect(res).toBe('padre')
      })
  });
})

xdescribe('DATABASE GET DB HELPER TESTS. IF DB IS CLEARED IGNORE', () => {

  test('Gets correct collections ', () => {
    return db.getAllCollections(14)
      .then((res) => {
        let names = res.map((collection)=>{
          return collection.name;
        });
        expect(names).toContain('Soooo');
        expect(names.length).toBe(3);
      })
  });
  test('Database should have all languages in language table', () => {
    return db.getAllLanguages()
      .then((languages) => {
        expect(languages.length).toBe(13);
        return null
      })
  });
  
  test('Successfully finds user from users table', () => {
    return db.findUser('pr@pr.com')
      .then((user) => {
        expect(user.id).toBe(14);
        return null
      })
  });
  
  test('Successfully gets Collection Items', () => {
    return db.getAllCollectionItems(47)
      .then((items) => {
        expect(items.length).toBe(6)
        expect(items[0].currentTranslation).not.toBeUndefined();
        expect(items[0].itemId).not.toBeUndefined();
        expect(items[0].nativeTranslation).not.toBeUndefined();
        expect(items[0].url_image).not.toBeUndefined();
      });
  });

})
describe('CREATES USER', () => {
  let userId;
  beforeAll(() => {
    return db.makeUser('jesttest', 'jesttest@jesttest.com', 1, 2, 0)
      .then((created) => {
        userId = created.id;
        return null;
      });
  });

  test('Succesfully Adds User, and then finds him in db', () => {
    return db.findUser('jesttest@jesttest.com')
      .then((result) => {
        expect(result.id).toBe(userId);
      });
  });

  afterAll(() => {
    return db.deleteUser('jesttest', 'jesttest@jesttest.com')
  });
});

describe('CREATES COLLECTION', () => {
  let userId;
  let collectionId;
  // beforeAll(() => {
    
  // }); 
  
  test('Added both a user and collection, and collection exists in db', () => {
    return db.makeUser('jesttest', 'jesttest@jesttest.com', 1, 2, 0)
      .then((created) => {
        userId = created.id;
        return db.createCollection(userId, 'jesttest')
      })
      .then((collection) => {
        collectionId = collection.id
        return db.getAllCollections(userId)
      })
      .then((items) => {
        expect(items[0].name).toBe('jesttest')
        return null;
      });
  });


  afterAll(() => {

    db.deleteCollection('jesttest', userId)
      .then((result) => {
        return db.deleteUser('jesttest', 'jesttest@jesttest.com')
      })
      .then((result)=>{
        return null
      })


  });

})


// describe('CREATES USER', () => {
// let userId;
// let collectionId;
//   beforeAll(() => {
//     return db.makeUser('jesttest', 'jesttest@jesttest.com', 1, 2, 0)
//       .then((created) => {
//         userId = created.id;
//       })
//       .then(() => {
//         return db.createCollection(userId, 'jesttest')
//       })
//       .then((collection)=>{
//         collectionId = collection.id
//       })
//   });

//   test('Added both a user and collection, and collection exists in db', () => {
//     return db.makeNewCollectionItem(collectionId, 'https://marmelab.com/images/blog/jest.png', )
//   });


// })