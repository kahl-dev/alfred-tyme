'use strict';
const Alfy = require('alfy');
const Tyme = require('./tyme');

class Handler {
  static getTasks() {
    // @TODO sort latest uses
    const projects = Alfy.cache.get('projects');
    const tasks = Alfy.cache.get('tasks');

    const items = tasks.map(task => {
      const index = projects.findIndex(obj => obj.id === task.relatedprojectid);
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

    Alfy.output(items);
  }

  /**
   * @TODO add possibillity to to add own default notes
   */
  static getNotes() {
    const task = process.env.task ? JSON.parse(process.env.task) : undefined;
    const taskRecords = Alfy.cache.get(`taskRecordsByTaskId:${task.id}`);
    const items = [
      {
        title: '-- Add new note --',
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

    Alfy.output(items);
  }

  static startTracking(value) {
    // @TODO add note to respond message
    const task = process.env.task ? JSON.parse(process.env.task) : undefined;
    Tyme.startTrackerForTaskId(task.id, value)
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

  static stopTracking() {
    Tyme.stopTrackerFortTaskId()
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

module.exports = Handler;
