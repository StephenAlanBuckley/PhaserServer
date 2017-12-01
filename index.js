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
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static('static'))


//Homepage
app.get('/', (request, response) => {
  response.render('screen', {
    scripts: [
      "/js/phaser.js",
      "/js/player.js",
      "/js/enemyManager.js",
      "/js/enemyTank.js",
      "/js/obstacleManager.js",
      "/js/game.js"
    ]
  })
})

//Debug
app.get('/debug', (request, response) => {
  response.render('screen', {
    scripts: [
      '/js/phaser.js',
      '/js/Actions/base.js',
      '/js/Actions/Environment/absorb.js',
      '/js/Actions/Environment/forage.js',
      '/js/Actions/Self/move.js',
      '/js/Actions/Self/rotate.js',
      '/js/HUD.js',
      '/js/actionManager.js',
      '/js/cameraControls.js',
      '/js/creature.js',
      '/js/creatureManager.js',
      '/js/debugging.js',
      '/js/enemyManager.js',
      '/js/enemyTank.js',
      '/js/energyPacket.js',
      '/js/game.js',
      '/js/genetics/chromosome.js',
      '/js/obstacleManager.js',
      '/js/player.js',
      '/js/sense.js',
      '/js/soil.js',
      '/js/soilManager.js' ]
  })
})


//every server should serve this beautiful quine
app.get('/world', (request, response) => {
  response.render('screen', {
    name: 'HELLO',
    scripts: [
      "/js/quineworld.js",
    ]
  })
})

//example tanks page
app.get('/tanks', (request, response) => {
  response.render('screen', {
    scripts: [
      "/js/phaser.js",
      "/js/player.js",
      "/js/enemyManager.js",
      "/js/enemyTank.js",
      "/js/game.js"
    ]
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
