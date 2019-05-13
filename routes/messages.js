const express = require('express');
const router = express.Router();
const { db } = require('../database/models.js');







// router.get('/all', (req, res) => {

//   const { userId, buddyId } = req.body;

//   db.getMessages(userId, buddyId)
//     .then(([userMessages, buddyMessages]) => {
//       res.json({
//         userMessages,
//         buddyMessages,
//       })
//     })
//     .catch(err => {
//       console.error(err);
//     })

// })

// router.post('/new', (req, res) => {

//   const { userId, buddyId } = req.body;

//   db.addMessage(userId, buddyId)
//     .then(newMessage => {
//       res.json(newMessage);
//     })
//     .catch(err => {
//       console.error(err);
//       res.sendStatus(500);
//     })

// })

module.exports = router;