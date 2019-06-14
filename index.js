'use strict'
const alfy = require('alfy')
const handler = require('./handler')
const cache = require('./cache')
const alfredNotifier = require('alfred-notifier')
const index = { cache, handler }
const [fn, action, value] = process.argv[2].split(':')

alfredNotifier()

// @TODO add export // external workflow
// @TODO creat tasks from browser
// @TODO archive multiple

index[fn][action](value)
