const Sequelize = require('sequelize');

////////////////////
////CONNECTION//////
///////////////////

const sequelize = new Sequelize('vocapp', process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres'
});

////////////////////
//////MODELS////////
////////////////////


/// User Model ///

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING
  },
  points: {
    type: Sequelize.INTEGER
  },
});

//Collection Model ///

const Collection = sequelize.define('collection', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  is_public: {
    type: Sequelize.BOOLEAN
  },
  count: {
    type: Sequelize.INTEGER
  }
})

//Collection_items Model//

const CollectionItem = sequelize.define('collection_item', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  image_url: {
    type: Sequelize.STRING
  },
})

//Languages Model//

const Language = sequelize.define('language', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  lang_code: Sequelize.STRING,
  flag_url: {
    type: Sequelize.STRING
  },
  active: {
    type: Sequelize.BOOLEAN
  }
})

//Words Model//

const Word = sequelize.define('word', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  eng_word: {
    type: Sequelize.STRING
  }
})

//Lessons //

const Lesson = sequelize.define('lesson', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
})

//Translations//

const Translation = sequelize.define('translation', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  text: {
    type: Sequelize.STRING
  },
  audio_url: {
    type: Sequelize.STRING
  }
});



////////////////////
////RELATIONSHIPS///
////////////////////

//Language OTM Users - native language //
User.belongsTo(Language, {as: 'native_language'});
Language.hasOne(User, {as: 'native_language'});

//Language OTM Users - current language //
User.belongsTo(Language, {as: 'current_language'});
Language.hasOne(User, {as: 'current_language'});

//User OTM Collections //
Collection.belongsTo(User);
User.hasMany(Collection);

//User-Languages MTM //
User.belongsToMany(Language, { as: 'user', through: { model: Lesson, unique: false }});
Language.belongsToMany(User, { as: 'user', through: { model: Lesson, unique: false }});

//Words-Languages MTM //
Word.belongsToMany(Language, {as: 'word', through: {model: Translation, unique: false}});
Language.belongsToMany(Word, {as: 'word', through: {model: Translation, unique: false}});

//Words OTM Collection Items//
CollectionItem.belongsTo(Word);
Word.hasOne(CollectionItem);

//Collection OTM Collection_items //
CollectionItem.belongsTo(Collection);
Collection.hasMany(CollectionItem);



/////////////////////
/////HELPERS/////////
/////////////////////





/////////////////////
///////SYNC////////
/////////////////////


sequelize
  .sync(/* {force: true} */)
  .then(result => {
    console.log('succesfully connected to database');
    // adds languages if they do not exist
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
    const langPromses = languages.map(lang => new Promise((res, rej) => {
        Language.findOrCreate({
          where: lang,
        })
            .then(rows => res(rows))
    }))
    return Promise.all(langPromses);
  })
  .then(() => {
    // adds moch data
    // require("../mochData/moch")()
  })
  .catch(err => {
    console.log('could not connect to database', err);
  });


//////////////////////
///////EXPORTS////////
//////////////////////

module.exports.Collection = Collection;
module.exports.CollectionItem = CollectionItem;
module.exports.User = User;
module.exports.Language = Language;
module.exports.Word = Word;
module.exports.Lesson = Lesson;
module.exports.Translation = Translation;