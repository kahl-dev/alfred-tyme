'use strict';
const alfy = require('alfy');
const tyme = require('./tyme');
const runJxa = require('run-jxa');
const [id = undefined, action, subaction = 'all'] = process.argv[2].split(':');

// :cache:timerStartedForTaskRecord
// :cache:timerStoppedForTaskRecord
// :cache:timeoutDetectedForTaskRecord
// :cache:projectCompletedChanged
// :cache:taskCompletedChanged

switch (true) {
  case action === 'cache' && subaction === 'updateTaskForTaskRecordId':
    {
      tyme
        .getTaskRecordIds(id)
        .then(data => {
          return tyme.taskRecordsForTaskId(data.taskRecord.relatedtaskid);
        })
        .then(data => {
          alfy.cache.set(
            `taskRecordsForTaskId:${data.taskRecords[0].relatedtaskid}`,
            data.taskRecords
          );
        })
        .catch(console.log);
    }
    break;
  case action === 'cache' && subaction === 'all':
    {
      alfy.log('all');
      runJxa(() => {
        const tyme = Application('Tyme2');

        const tymeProjects = tyme.projects.whose({ completed: false });
        const projects = [];
        const tasks = [];
        for (projectIndex in tymeProjects) {
          projects.push(tymeProjects[projectIndex].properties());

          const tymeTasks = tyme.projects[projectIndex].tasks.whose({
            completed: false,
          });
          for (taskIndex in tymeTasks) {
            tasks.push(tymeTasks[taskIndex].properties());
          }
        }

        return { projects, tasks };
      })
        .then(data => {
          alfy.cache.set('projects', data.projects);
          alfy.cache.set('tasks', data.tasks);

          console.log('successfully cached data');
        })
        .catch(console.log);
    }
    break;
}
