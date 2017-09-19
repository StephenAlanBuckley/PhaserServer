const path = require('path')
const extend = require('util')._extend;

var development = require('./env/development');
var production = require('./env/production');

var defaults = {
  root: path.normalize(__dirname + '/..')
}

module.exports = {
  development: extend(development, defaults),
  production: extend(production, defaults),
  prod: extend(production, defaults), //just my preferred name and idk what I'll use at any given moment
}[process.env.NODE_ENV || 'development']
