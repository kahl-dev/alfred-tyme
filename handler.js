'use strict';
const alfy = require('alfy');
const tyme = require('./tyme');
const handler = module.exports;

handler.getTasks = () => {
  const items = alfy.cache.get('handler.getTasks');
  alfy.output(items);
};

handler.getNotes = () => {
  // @TODO add possibillity to to add own default notes
  const task = process.env.task ? JSON.parse(process.env.task) : undefined;
  const taskRecords = alfy.cache.get(`taskRecordsByTaskId:${task.id}`);
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

  alfy.output(items);
};

handler.startTracking = value => {
  // @TODO add note to respond message
  const task = process.env.task ? JSON.parse(process.env.task) : undefined;
  tyme
    .startTrackerForTaskId(task.id, value)
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
};

handler.stopTracking = () => {
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
};
