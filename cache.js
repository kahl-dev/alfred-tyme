'use strict';
const alfy = require('alfy');
const tyme = require('./tyme');
const [type = 'cache', func = 'default', id] = process.argv[2].split(':');

class Cache {
  static updateProjects() {
    tyme
      .projects()
      .then(data => {
        alfy.cache.set('projects', data);
      })
      .catch(console.log);
  }

  static updateProject(id) {
    let projects = alfy.cache.get('projects');
    if (!projects) {
      this.updateProjects();
      return;
    }

    tyme
      .projectById(id)
      .then(data => {
        if (data) {
          const index = projects.findIndex(project => project.id === data.id);
          if (data.completed === false) {
            projects = [
              ...projects.slice(0, index),
              data,
              ...projects.slice(index + 1),
            ];
          } else {
            projects = [
              ...projects.slice(0, index),
              ...projects.slice(index + 1),
            ];
          }
        }

        alfy.cache.set('projects', projects);
      })
      .catch(console.log);
  }

  static updateTasks(id) {
    tyme
      .tasks()
      .then(data => {
        alfy.cache.set('tasks', data);
      })
      .catch(console.log);
  }

  static updateTask(id) {
    let tasks = alfy.cache.get('tasks');
    if (!tasks) {
      this.updateTasks();
      return;
    }

    tyme
      .taskById(id)
      .then(data => {
        if (data) {
          const index = tasks.findIndex(task => task.id === data.id);
          if (data.completed === false) {
            tasks = [...tasks.slice(0, index), data, ...tasks.slice(index + 1)];
          } else {
            tasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
          }
        }

        alfy.cache.set('tasks', tasks);
      })
      .catch(console.log);
  }

  static updateTaskForTaskRecordId(id) {
    tyme
      .taskRecordById(id)
      .then(data => {
        return tyme.taskRecordsByTaskId(data.taskRecord.relatedtaskid);
      })
      .then(data => {
        alfy.cache.set(
          `taskRecordsByTaskId:${data.taskRecords[0].relatedtaskid}`,
          data.taskRecords
        );
      })
      .catch(console.log);
  }

  static default() {
    this.updateProjects();
    this.updateTasks();
  }
}

Cache[func](id);
