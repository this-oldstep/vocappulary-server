require('dotenv').config()
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
  id_languages_native : {
    type: Sequelize.INTEGER
  },
  id_languages_current : {
    type: Sequelize.INTEGER
  },
  points: {
    type: Sequelize.INTEGER
  }
});

//Collection Model ///

const Collection = sequelize.define('collection', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  public: {
    type: Sequelize.BOOLEAN
  },
  user_id: {
    type: Sequelize.INTEGER
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
  id_collection: {
    type: Sequelize.INTEGER
  },
  image_url: {
    type: Sequelize.STRING
  },
  id_eng_word: {
    type: Sequelize.INTEGER
  }
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
  id_user: {
    type: Sequelize.INTEGER
  },
  id_language: {
    type: Sequelize.INTEGER
  }
})

//Translations//

const Translation = sequelize.define('translation', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  id_word: {
    type: Sequelize.INTEGER
  },
  id_lang: {
    type: Sequelize.INTEGER
  },
  word: {
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

//Language OTM Users - current language //

//User OTM Collections //

//User-Languages MTM //

//Words-Languages MTM //

//Words OTM Collections//

//Collection OTM Collection_items //



/////////////////////
/////HELPERS/////////
/////////////////////





/////////////////////
///////SYNC////////
/////////////////////


sequelize
  .sync()
  .then(result => {
    console.log('succesfully connected to database', result);
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