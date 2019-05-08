// const { Collection } = require('../database/config.js');
const {db} = require('../database/models.js');

const getAllCollections = db.getAllCollections

module.exports.getAllCollections = getAllCollections