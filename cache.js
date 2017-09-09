'use strict';
const Alfy = require('alfy');
const Tyme = require('./tyme');

class Cache {
  static updateProjects() {
    Tyme.projects()
      .then(data => {
        Alfy.cache.set('projects', data);
      })
      .catch(console.log);
  }

  static updateProject(id) {
    let projects = Alfy.cache.get('projects');
    if (!projects) {
      this.updateProjects();
      return;
    }

    Tyme.projectById(id)
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

        Alfy.cache.set('projects', projects);
      })
      .catch(console.log);
  }

  static updateTasks(id) {
    Tyme.tasks()
      .then(data => {
        Alfy.cache.set('tasks', data);
      })
      .catch(console.log);
  }

  static updateTask(id) {
    let tasks = Alfy.cache.get('tasks');
    if (!tasks) {
      this.updateTasks();
      return;
    }

    Tyme.taskById(id)
      .then(data => {
        if (data) {
          const index = tasks.findIndex(task => task.id === data.id);
          if (data.completed === false) {
            tasks = [...tasks.slice(0, index), data, ...tasks.slice(index + 1)];
          } else {
            tasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
          }
        }

        Alfy.cache.set('tasks', tasks);
      })
      .catch(console.log);
  }

  static updateTaskForTaskRecordId(id) {
    Tyme.taskRecordById(id)
      .then(data => {
        return Tyme.taskRecordsByTaskId(data.taskRecord.relatedtaskid);
      })
      .then(data => {
        Alfy.cache.set(
          `taskRecordsByTaskId:${data.taskRecords[0].relatedtaskid}`,
          data.taskRecords
        );
      })
      .catch(console.log);
  }

  static default() {
    Alfy.cache.clear();

    this.updateProjects();
    this.updateTasks();

    Tyme.tasks()
      .then(data => {
        const promises = [];
        data.forEach(task => {
          promises.push(Tyme.taskRecordsByTaskId(task.id, 10));
        });
        return Promise.all(promises);
      })
      .then(data => {
        data.forEach(req => {
          if (req.successful && req.taskRecords.length)
            Alfy.cache.set(
              `taskRecordsByTaskId:${req.taskRecords[0].relatedtaskid}`,
              req.taskRecords
            );
        });

        console.log('Successfully cache updated');
      })
      .catch(console.log);
  }
}

module.exports = Cache;
