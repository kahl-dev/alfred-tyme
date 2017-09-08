on timerStartedForTaskRecord(tskRecordID)
  tell application "Alfred 3" to run trigger "reload" in workflow "com.patrickkahl.tyme" with argument tskRecordID & ":cache:updateTaskForTaskRecordId"
end timerStartedForTaskRecord

on timerStoppedForTaskRecord(tskRecordID)
  tell application "Alfred 3" to run trigger "reload" in workflow "com.patrickkahl.tyme" with argument tskRecordID & ":cache:updateTaskForTaskRecordId"
end timerStoppedForTaskRecord

on timeoutDetectedForTaskRecord(tskRecordID)
  tell application "Alfred 3" to run trigger "reload" in workflow "com.patrickkahl.tyme" with argument tskRecordID & ":cache:updateTaskForTaskRecordId"
end timeoutDetectedForTaskRecord

on projectCompletedChanged(projectID)
  tell application "Alfred 3" to run trigger "reload" in workflow "com.patrickkahl.tyme" with argument projectID & ":cache:updateProjects"
end projectCompletedChanged

on taskCompletedChanged(tskID)
  tell application "Alfred 3" to run trigger "reload" in workflow "com.patrickkahl.tyme" with argument tskID & ":cache:updateTasks"
end taskCompletedChanged
