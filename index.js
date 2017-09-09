'use strict';
// @TODO auto cp tyme2 hook scpt
// @TODO add export // external workflow
// @TODO creat tasks from browser
// @TODO archive multiple
// @TODO fix start-id with mutated vowel
// @TODO Convert to UTF-8

const alfy = require('alfy');
const tyme = require('./tyme');
const project = process.env.project
  ? JSON.parse(process.env.project)
  : undefined;
const task = process.env.task ? JSON.parse(process.env.task) : undefined;
const key = process.argv[2];
const action = process.argv[3];

switch (true) {
  case action === 'start-task':
    {
      // @TODO sort latest uses
      const projects = alfy.cache.get('projects');
      const tasks = alfy.cache.get('tasks');

      const items = tasks.map(task => {
        const index = projects.findIndex(
          obj => obj.id === task.relatedprojectid
        );
        const project = projects[index];

        return {
          title: task.name,
          autocomplete: task.name,
          subtitle: project ? project.name : '',
          variables: {
            task: JSON.stringify(task),
          },
        };
      });

      alfy.output(items);
    }
    break;
  case action === 'start-note':
    {
      const taskRecords = alfy.cache.get(`taskRecordsByTaskId:${task.id}`);
      const items = [
        {
          title: 'Write new Note',
        },
        ...(taskRecords
          ? taskRecords
              .slice(-20)
              .map(taskRecord => taskRecord.note)
              .filter((elem, pos, arr) => {
                return arr.indexOf(elem) == pos;
              })
              .map(note => ({
                title: note,
                arg: note,
              }))
          : []),
      ];

      alfy.output(items);
    }
    break;
  case action === 'start-id':
    {
      // @TODO add note to respond message
      tyme
        .startTrackerForTaskId(task.id, key)
        .then(data => {
          if (data.task && data.successful) {
            console.log(`Task "${data.task.name}" successfully started.`);
          } else if (data.task === null && !data.successful) {
            console.log('No tracking task to start.');
          } else {
            console.log('Something went wrong');
          }
        })
        .catch(console.log);
    }
    break;
  case action === 'stop': {
    tyme
      .stopTrackerFortTaskId()
      .then(data => {
        if (data.task && data.successful) {
          console.log(`Task "${data.task.name}" successfully stopped.`);
        } else if (data.task === null && !data.successful) {
          console.log('No tracking task to stop.');
        } else {
          console.log('Something went wrong');
        }
      })
      .catch(console.log);
  }
}
