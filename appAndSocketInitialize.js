require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { db } = require('./database/models')

const WebSocket = require('ws');




const port = 3000;
const serverConnect = app.listen(port, () => console.log(`Vocapp server listening on port ${port}!`))
const WebSocketConnections = {
  usedPorts: {},
  activeUsers: {}
};

let portCounter = 4000;

const makeNewWebSocketConnection = (userId, buddyId) => {
  if(!WebSocketConnections.usedPorts[portCounter]) {
    const userPort = portCounter++;
    WebSocketConnections.usedPorts[userPort] = WebSocketConnections.activeUsers[userId] = ({userId, userPort, buddyId});
    WebSocketConnections.usedPorts[userPort].server = new WebSocket.Server({
      server: serverConnect,
      port: userPort,
    }) 
    WebSocketConnections.usedPorts[userPort].server.on('connection', socket => {
      WebSocketConnections.usedPorts[userPort].userSocket = socket;
      console.log(`User ${userId} has connected on port ${userPort}`)
      socket.on('message', (jsonObject) => {
        const { userId, buddyId, text } = JSON.parse(jsonObject);
        // db.addMessage(userId, buddyId, text)
        //   .then(message => {
            if(WebSocketConnections.activeUsers[buddyId]) {
              WebSocketConnections.activeUsers[buddyId].userSocket.send(JSON.stringify({text}));
            }
        //   })
        socket.send(JSON.stringify({text}));
      });
      // db.getMessages(userId, buddyId)
      //   .then(messages => {
      //     socket.send(JSON.stringify({messages}));
      //   })
      //   .catch(err => {
      //     console.error(err);
          socket.send(JSON.stringify({error: "messages not found"}))
      //   })
    });
    return userPort;
  } else {
    portCounter++;
    makeNewWebSocketConnection(userId);
  }

}

app.get('/newConnection/:userId/:buddyId', (req, res) => {

  const {userId, buddyId} = req.params

  // const userId = 17;

  // const buddyId = 2;

  res.json(makeNewWebSocketConnection(userId, buddyId));

})


// const server = new WebSocket.Server({ 
//   server: serverConnect,
//   port: 4000,
// });

// const logIt = () => {
//   console.log("it did the thing");
// }


// server.on('connection', socket => {
//   socket.on('message', message => {
//     console.log(`received from a client: ${message}`);
//   });
//   socket.send(JSON.stringify({message: 'Hello world!'}));
//   logIt();
// });

module.exports = {
  app,
}