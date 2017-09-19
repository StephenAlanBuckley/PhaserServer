const request = require('request-promise')

const post_options = {
  method: 'POST',
  uri: 'http://127.0.0.1:3000/users',
  body: {
    user: {
      name: 'Esteban',
      age: Math.floor((Math.random() * 100))
    }
  },
  json: true
}

request(post_options)
  .then(function (response) {
    console.log("Successfully POSTed\n", response)
  })
  .catch(function (err) {
    console.error("An error occurred", err)
  })


const get_options = {
  method: 'GET',
  uri: 'http://127.0.0.1:3000/users',
  json: true
}

request(get_options)
  .then(function (response) {
    console.log("Got the response\n", response)
  })
  .catch(function (err) {
    console.error("An error occurred", err)
  })
