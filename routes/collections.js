require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../database/config')



router.post('/', (req, res) => {

const name  = req.body.name;

db.Collection.create({
  name: name
})
.then((response) => {
  res.send(response);
}).catch((err) => {
  console.log(err);
});
});

router.get('/:id', (req, res)=>{
  let userId = req.params.id || 1
  Collection.findAll({
    where: {
      
    }
  })
});


module.exports = router;