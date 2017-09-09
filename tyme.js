const runJxa = require('run-jxa');

class Tyme {
  static projects({ completed = false } = {}) {
    return runJxa(
      arg => {
        const tyme = Application('Tyme2');
        const tymeProjects = tyme.projects.whose(arg)().map(project => ({
          completed: project.completed(),
          id: project.id(),
          name: project.name(),
          pcls: 'project',
        }));

        return tymeProjects;
      },
      [{ completed }]
    );
  }

  static projectById(id) {
    return runJxa(
      id => {
        const tyme = Application('Tyme2');
        const project = tyme.projects.byId(id);

        return {
          completed: project.completed(),
          id: project.id(),
          name: project.name(),
          pcls: 'project',
        };
      },
      [id]
    );
  }

  static tasks({ completed = false } = {}) {
    return runJxa(
      arg => {
        const tyme = Application('Tyme2');
        const tasks = tyme.projects.tasks.whose(
          arg
        )().reduce((arr, project) => {
          if (project.length)
            arr.push(
              ...project.map(task => ({
                completed: task.completed(),
                id: task.id(),
                name: task.name(),
                relatedprojectid: task.relatedprojectid(),
                pcls: 'task',
              }))
            );
          return arr;
        }, []);

        return tasks;
      },
      [{ completed }]
    );
  }

  static taskById(id) {
    return runJxa(
      id => {
        const tyme = Application('Tyme2');

        return tyme.projects.tasks.whose({
          id,
        })().reduce((arr, project) => {
          if (project.length)
            arr.push(
              ...project.map(task => ({
                completed: task.completed(),
                id: task.id(),
                name: task.name(),
                relatedprojectid: task.relatedprojectid(),
                pcls: 'task',
              }))
            );
          return arr;
        }, [])[0];
      },
      [id]
    );
  }

  static taskRecordsByTaskId(id) {
    return runJxa(
      id => {
        const tyme = Application('Tyme2');
        const returnValue = {
          successful: true,
          taskRecords: tyme.projects.tasks
            .whose({ id })
            .taskrecords()
            .filter(project => project.length)[0][0]
            .map(taskRecord => ({
              id: taskRecord.id(),
              note: taskRecord.note(),
              relatedprojectid: taskRecord.relatedprojectid(),
              relatedtaskid: taskRecord.relatedtaskid(),
              pcls: 'taskrecord',
            })),
        };

        return returnValue;
      },
      [id]
    );
  }

  static taskRecordById(id) {
    return runJxa(
      id => {
        const tyme = Application('Tyme2');
        const action = tyme.getrecordwithid(id);
        const returnValue = {
          successful: action,
        };

        if (action) {
          const taskRecord = tyme.lastfetchedtaskrecord;
          returnValue.taskRecord = {
            id: taskRecord.id(),
            note: taskRecord.note(),
            relatedprojectid: taskRecord.relatedprojectid(),
            relatedtaskid: taskRecord.relatedtaskid(),
            pcls: 'taskrecord',
          };
        }

        return returnValue;
      },
      [id]
    );
  }

  static startTrackerForTaskId(id, note) {
    return runJxa(
      (id, note) => {
        const tyme = Application('Tyme2');
        const returnValue = {
          successful: false,
        };

        if (id) {
          if (tyme.starttrackerfortaskid(id)) {
            const task = tyme.projects.tasks
              .whose({ id })[0]
              .get(0)
              .filter(task => task)[0];
            returnValue.task = {
              completed: task.completed(),
              id: task.id(),
              name: task.name(),
              relatedprojectid: task.relatedprojectid(),
              pcls: 'task',
            };
            returnValue.successful = true;
          }
        } else {
          returnValue.task = null;
        }

        if (note) {
          const taskRecord = tyme.projects.tasks
            .whose({ id })
            .taskrecords()
            .filter(project => project.length)[0][0]
            .slice(-1)
            .pop();
          if (taskRecord.note.set(note)) returnValue.taskRecord = taskRecord;
        }

        return returnValue;
      },
      [id, note]
    );
  }

  static stopTrackerFortTaskId() {
    return runJxa(() => {
      const tyme = Application('Tyme2');
      const id = tyme.trackedtaskids.get(0)[0];
      const returnValue = {
        successful: false,
      };

      if (id) {
        const action = tyme.stoptrackerfortaskid(id);
        if (action) {
          const task = tyme.projects.tasks
            .whose({ id })[0]
            .get(0)
            .filter(task => task)[0];

          returnValue.task = {
            completed: task.completed(),
            id: task.id(),
            name: task.name(),
            relatedprojectid: task.relatedprojectid(),
            pcls: 'task',
          };
        }

        returnValue.successful = action;
      } else {
        returnValue.task = null;
      }

      return returnValue;
    });
  }
}

module.exports = Tyme;
