const {hello} = require('./hello.js');
const {googleTranslate} = require('../apiHelpers.js');
const axios = require('axios')


test('should be defined', () =>{
  expect(hello).toBeDefined()
})

test('english to spanish translation', () => {
  return googleTranslate('father', 'en', 'es')
    .then((res)=>{
      console.log(res)
      expect(res).toBe('padre')
    })
    // expect(googleTranslate('father', 'en', 'es')).rejects.toBe('padre');


});

// googleTranslate('father', 'en', 'es').