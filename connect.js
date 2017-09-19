'use strict'

const pg = require('pg')
const config = require('./config/config')

const conString = config.db
const pool = new pg.Pool({
  connectionString: conString,
})

/*
pool.connect(function(err, client, done) {
  if (err) {
    console.error('error connecting to psql db', err)
    return;
  }

  client.query('SELECT $1::varchar AS my_first_query', ['node_hero'], function(err, result) {
        done()
        if (err) {
          console.error('error happened during query', err)
          return;
        }
        console.log(result.rows[0])
        process.exit(0)
      }
  )
})

pool.end()
*/
