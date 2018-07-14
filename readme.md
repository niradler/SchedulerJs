## SchedulerJs

Scheduler for node js to timing time base tasks.

### How to use

- npm i --save @niradler55/schedulerjs

```javascript
const Scheduler = require('@niradler55/schedulerjs/dist');
const sch = new Scheduler();
const task = {
    title: 'example',
    fn: () => console.log('run every 1 second, success', new Date()), //function to run
    onFailed: (e) => console.log(e), //fall back function when primary function crash
    repeatPeriod: 1000, //repeat period in milliseconds
    isRepeat: true, // run one time or every time period.
  };

  sch.start();
  sch.addTask(task)
```

### APIs

#### .start

`.start` 

init the scheduler, and start looking for tasks.

#### .addTask

`.addTask(task, [tasks...])`

`.addTask` take one task or array of tasks.

add task or tasks to tasks list.

#### .stop

`.stop`

stop looking for tasks (going idle).

#### .getLogByProcessId

`.getLogByProcessId(processId)`

`.getLogByProcessId`

return log for the current instance or by given id.

#### .updateTask

`.updateTask(locString, task)`

`.updateTask`

update task at location.

#### .deleteTask

`.deleteTask(locString)`

`.deleteTask`

delete task at location.

### Properties

#### .log

`.log`

get all log event

#### .tasks

`.tasks`

get all tasks