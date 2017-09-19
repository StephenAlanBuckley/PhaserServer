const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const pg = require('pg')
const config = require('./config/config')

//Setup PG Connection Pool
const conString = config.db
const pool = new pg.Pool({
  connectionString: conString,
})

const port = 3000

const app = express()

//make handlebars the view engine
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//Homepage
app.get('/', (request, response) => {
  response.render('home', {
    name: 'HELLO'
  })
})

//Post name and age to users endpoint to save a user to DB
app.post('/users', function (request, response, next) {
  const user = request.body.user

  pool.connect(function (err, client, done) {
    if (err) {
      next(err)
    }

    client.query('INSERT INTO users (name, age) VALUES ($1, $2);', [user.name, user.age], function(err, result) {
      done()
      if (err) {
        return next(err)
      }

      response.send(200)
    })
  })
})

app.get('/users', function (request, response, next) {
	pool.connect(function (err, client, done) {
    if (err) {
			next(err)
		}
		client.query('SELECT name, age FROM users;', [], function (err, results) {
			if (err) {
				return next(err)
			}
			response.json(results.rows)
		})
	})
})



app.listen(port, (err) => {
  if (err) {
    return console.log(`couldn't establish server on port ${port}`, err)
  }

  console.log(`server is listening on port ${port}`)
})
