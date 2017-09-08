const runJxa = require('run-jxa');

class Tyme {
  static startTrackerForTaskId(id, note) {
    return runJxa(
      (id, note) => {
        const tyme = Application('Tyme2');
        const returnValue = {
          successful: false,
        };

        if (id) {
          if (tyme.starttrackerfortaskid(id)) {
            returnValue.task = tyme.projects[0].tasks.byId(id).properties();
            returnValue.successful = true;
          }
        } else {
          returnValue.task = null;
        }

        if (note) {
          const taskRecord = tyme.projects[0].tasks
            .byId(id)
            .taskrecords()
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
        if (action)
          returnValue.task = tyme.projects.tasks
            .whose({ id })[0]
            .get(0)[0]
            .properties();
        returnValue.successful = action;
      } else {
        returnValue.task = null;
      }

      return returnValue;
    });
  }

  static taskRecordsForTaskId(id) {
    return runJxa(
      id => {
        const tyme = Application('Tyme2');
        const returnValue = {
          successful: true,
          taskRecords: tyme.projects[0].tasks
            .byId(id)
            .taskrecords()
            .map(tr => tr.properties()),
        };

        return returnValue;
      },
      [id]
    );
  }

  static getTaskRecordIds(id) {
    return runJxa(
      id => {
        const tyme = Application('Tyme2');
        const action = tyme.getrecordwithid(id);
        const returnValue = {
          successful: action,
        };

        if (action) {
          returnValue.taskRecord = tyme.lastfetchedtaskrecord.properties();
        }

        return returnValue;
      },
      [id]
    );
  }
}

module.exports = Tyme;
