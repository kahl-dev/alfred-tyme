'use strict';
const alfy = require('alfy');
const tyme = require('./tyme');
const cache = module.exports;

cache.creatStartTaskOutput = () => {
  const projects = alfy.cache.get('projects');
  const tasks = alfy.cache.get('tasks');

  if (!projects && !tasks) return;

  const items = tasks
    .sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate))
    .map(task => {
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

  alfy.cache.set('handler.getTasks', items);
};

cache.updateProjects = () => {
  tyme
    .projects()
    .then(data => {
      alfy.cache.set('projects', data);
    })
    .catch(console.log);
};

cache.updateProject = id => {
  let projects = alfy.cache.get('projects');
  if (!projects) {
    cache.updateProjects();
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
      cache.creatStartTaskOutput();
    })
    .catch(console.log);
};

cache.updateTasks = id => {
  tyme
    .tasks()
    .then(data => {
      alfy.cache.set('tasks', data);
    })
    .catch(console.log);
};

cache.updateTask = id => {
  let tasks = alfy.cache.get('tasks');
  if (!tasks) {
    cache.updateTasks();
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
      cache.updateProject(data.relatedprojectid);
      cache.creatStartTaskOutput();
    })
    .catch(console.log);
};

cache.updateTaskForTaskRecordId = id => {
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

      cache.updateTask(data.taskRecords[0].relatedtaskid);
    })
    .catch(console.log);
};

cache.default = () => {
  alfy.cache.clear();

  cache.updateProjects();
  cache.updateTasks();

  tyme
    .tasks()
    .then(data => {
      const promises = [];
      data.forEach(task => {
        promises.push(tyme.taskRecordsByTaskId(task.id, 10));
      });
      return Promise.all(promises);
    })
    .then(data => {
      data.forEach(req => {
        if (req.successful && req.taskRecords.length)
          alfy.cache.set(
            `taskRecordsByTaskId:${req.taskRecords[0].relatedtaskid}`,
            req.taskRecords
          );
      });

      cache.creatStartTaskOutput();
      console.log('Successfully cache updated');
    })
    .catch(console.log);
};
