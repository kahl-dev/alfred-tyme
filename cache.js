'use strict'
const sh = require('shelljs')
const alfy = require('alfy')
const tyme = require('tyme2')
const cache = module.exports

const TYME_PATH = '~/Library/Application Scripts/de.lgerckens.Tyme2/'
const TYME_HOOKS_FILE = 'tyme2_applescript_hooks.scpt'

cache.createTaskOutput = () => {
  Promise.all([tyme.projects(), tyme.tasks()])
    .then(data => {
      const [projects, tasks] = data

      const items = tasks
        .sort((a, b) => {
          return new Date(b.lastUpdate) - new Date(a.lastUpdate)
        })
        .map(task => {
          const index = projects.findIndex(
            obj => obj.id === task.relatedprojectid
          )
          const project = projects[index]

          return {
            title: task.name,
            subtitle: project ? project.name : '',
            variables: {
              task: JSON.stringify(task),
            },
          }
        })

      alfy.cache.set('handler.getTasks', items)
    })
    .catch(console.log)
}

cache.createTasksNotesOutput = () => {
  tyme
    .tasks()
    .then(tasks =>
      Promise.all(tasks.map(task => tyme.taskRecordsByTaskId(task.id, 10)))
    )
    .then(tasks => {
      tasks.forEach(item => {
        const task = item.task
        const taskRecords = item.taskRecords
        const items = [
          {
            title: '-- Add new note --',
          },
          ...taskRecords
            .sort((a, b) => new Date(b.timeend) - new Date(a.timeend))
            .map(taskRecord => taskRecord.note)
            .filter((elem, pos, arr) => {
              return arr.indexOf(elem) == pos
            })
            .map(note => ({
              title: note,
              arg: note,
            })),
        ]

        alfy.cache.set(`handle.getNotes.${task.id}`, items)
      })
    })
    .catch(console.log)
}

cache.updateProject = id => {
  cache.createTaskOutput()
}

cache.updateTask = id => {
  cache.createTaskOutput()
}

cache.updateTaskForTaskRecordId = id => {
  const taskRecords = tyme
    .taskRecordById(id)
    .then(data => tyme.taskRecordsByTaskId(data.taskRecord.relatedtaskid, 10))
    .then(data => {
      const task = data.task
      const taskRecords = data.taskRecords
      const items = [
        {
          title: '-- Add new note --',
        },
        ...taskRecords
          .sort((a, b) => new Date(b.timeend) - new Date(a.timeend))
          .map(taskRecord => taskRecord.note)
          .filter((elem, pos, arr) => {
            return arr.indexOf(elem) == pos
          })
          .map(note => ({
            title: note,
            arg: note,
          })),
      ]

      cache.createTaskOutput()
      alfy.cache.set(`handle.getNotes.${task.id}`, items)
    })
    .catch(console.log)
}

cache.default = () => {
  alfy.cache.clear()

  if (!sh.test('-f', TYME_PATH + TYME_HOOKS_FILE))
    sh.cp(TYME_HOOKS_FILE, TYME_PATH)

  cache.createTaskOutput()
  cache.createTasksNotesOutput()
}
