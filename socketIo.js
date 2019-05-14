const io = require('socket.io')(require('./appInitialization').httpInstance);
const { db } = require('./database/models');


const activeUsers = {}

let roomCount = 0;

const activeRooms = {};

io.on('connection', function (socket) {
  console.log("a user has connected");
  
  const removeFromActiveUsers = (userId) => {

    delete activeUsers[userId]
    console.log(`user ${userId} has disconnected`);
    
  }

  const joinBuddyRoom = (userId, buddyId) => {
    if(activeUsers[buddyId]) {
      if(activeUsers[buddyId].buddyId !== userId && activeUsers[buddyId].userId !== userId) {
        connectToNewRoom(userId, buddyId)
      } else {
        const buddyRoom = activeUsers[buddyId].activeRoom;
        activeUsers[userId] = activeUsers[buddyId];
        socket.join(buddyRoom);
        console.log(`User${userId} has joined ${buddyRoom}`)
      }
    } else {
      connectToNewRoom(userId, buddyId);
    }
  }

  const connectToNewRoom = (userId, buddyId) => {
    const newRoom = `room${roomCount++}`;
    if(activeRooms[newRoom]) {
      connectToNewRoom(userId);
      return;
    } else {
      activeUsers[userId] = activeRooms[newRoom] = {
        activeRoom: newRoom,
        userId: userId,
        buddyId: buddyId,
      }
      socket.join(newRoom);
      console.log(`User${userId} has joined ${newRoom}`)
    }
  }

  defaultNamespaceSocket = socket;
  socket.emit('news', { hello: 'world' });
  socket.on('message', async ({userId, buddyId, text}) => {
    db.addMessage(userId, buddyId, text);
    if(!activeUsers[userId]) {
      await joinBuddyRoom(userId, buddyId)
    }
    io.to(activeUsers[userId].activeRoom).emit('recieve', {text, senderId: userId, recieverId: buddyId});
    console.log(text);
  });
  socket.on('connectMessage', ({userId, buddyId}) => {
    joinBuddyRoom(userId, buddyId);
  })
  socket.send("You have connected to the server");
  socket.on('discon', (userId) => {
    removeFromActiveUsers(userId);
  })
  socket.on('disconnect', (reason) => {
    console.log(reason);
  })
});


module.exports = {
  io,
};