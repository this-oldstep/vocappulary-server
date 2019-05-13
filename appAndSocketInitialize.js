require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const WebSocket = require('ws');




const port = 3000;
const server = new WebSocket.Server({ 
  server: app.listen(port, () => console.log(`Vocapp server listening on port ${port}!`)),
  port: 4000,
});

const logIt = () => {
  console.log("it did the thing");
}


server.on('connection', socket => {
  socket.on('message', message => {
    console.log(`received from a client: ${message}`);
  });
  socket.send(JSON.stringify({message: 'Hello world!'}));
  logIt();
});

module.exports = {
  app,
}