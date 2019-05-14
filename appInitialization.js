require('dotenv').config();
const express = require('express');
const app = express();

const port = 3000;
const httpInstance = app.listen(port, () => console.log(`Vocapp server listening on port ${port}!`));

module.exports = {
  app,
  httpInstance
}