'use strict'
const alfy = require('alfy')
const tyme = require('tyme2')
const handler = module.exports

handler.getTasks = value => {
  const data = alfy.cache.get('handler.getTasks')
  let items = alfy.matches(
    value,
    data,
    (item, input) =>
      item.title.search(new RegExp(input.trim(), 'i')) > -1 ||
      item.subtitle.search(new RegExp(input.trim(), 'i')) > -1
  )

  if (!items.length) items = [{ title: 'No items found' }]

  alfy.output(items)
}

handler.getNotes = value => {
  // @TODO add possibillity to to add own default notes
  const task = process.env.task ? JSON.parse(process.env.task) : undefined
  const data = alfy.cache.get(`handle.getNotes.${task.id}`)
  const items = alfy.matches(value, data, (item, input) => {
    return item.title.search(new RegExp(input.trim(), 'i')) > -1
  })

  alfy.output(items)
}

handler.startTracking = value => {
  // @TODO add note to respond message
  const task = process.env.task ? JSON.parse(process.env.task) : undefined
  tyme
    .startTrackerForTaskId(task.id, value)
    .then(data => {
      if (data.task && data.successful) {
        console.log(`Task "${data.task.name}" successfully started.`)
      } else if (data.task === null && !data.successful) {
        console.log('No tracking task to start.')
      } else {
        console.log('Something went wrong')
      }
    })
    .catch(console.log)
}

handler.stopTracking = () => {
  tyme
    .stopTrackerFortTaskId()
    .then(data => {
      if (data.task && data.successful) {
        console.log(`Task "${data.task.name}" successfully stopped.`)
      } else if (data.task === null && !data.successful) {
        console.log('No tracking task to stop.')
      } else {
        console.log('Something went wrong')
      }
    })
    .catch(console.log)
}
