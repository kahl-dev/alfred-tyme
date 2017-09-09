on timerStartedForTaskRecord(tskRecordID)
  tell application "Alfred 3" to run trigger "reload" in workflow "com.patrickkahl.tyme" with argument "cache:updateTaskForTaskRecordId:" & tskRecordID
end timerStartedForTaskRecord

on timerStoppedForTaskRecord(tskRecordID)
  tell application "Alfred 3" to run trigger "reload" in workflow "com.patrickkahl.tyme" with argument "cache:updateTaskForTaskRecordId:" & tskRecordID
end timerStoppedForTaskRecord

on timeoutDetectedForTaskRecord(tskRecordID)
  tell application "Alfred 3" to run trigger "reload" in workflow "com.patrickkahl.tyme" with argument "cache:updateTaskForTaskRecordId:" & tskRecordID
end timeoutDetectedForTaskRecord

on projectCompletedChanged(projectID)
  tell application "Alfred 3" to run trigger "reload" in workflow "com.patrickkahl.tyme" with argument "cache:updateProject:" & projectID
end projectCompletedChanged

on taskCompletedChanged(tskID)
  tell application "Alfred 3" to run trigger "reload" in workflow "com.patrickkahl.tyme" with argument "cache:updateTask:" & tskID
end taskCompletedChanged
