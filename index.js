'use strict';
const Alfy = require('alfy');
const Handler = require('./handler');
const Cache = require('./cache');

// @TODO auto cp tyme2 hook scpt
// @TODO add export // external workflow
// @TODO creat tasks from browser
// @TODO archive multiple

class Index {
  static handler(action, value) {
    Handler[action](value);
  }

  static cache(action, value) {
    Cache[action](value);
  }
}

const task = process.env.task ? JSON.parse(process.env.task) : undefined;
const [fn, action, value] = process.argv[2].split(':');
Index[fn](action, value);
