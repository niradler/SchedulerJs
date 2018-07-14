
const Scheduler = require('@niradler55/schedulerjs/dist');
const sch = new Scheduler();
const task = {
    title: 'example',
    fn: () => console.log('run every 1 second, success', new Date()),
    onFailed: (e) => console.log(e),
    repeatPeriod: 1000,
    isRepeat: true,
  };

  sch.start();
  sch.addTask(task)
  console.log('starting...');
  console.log('look at the console, to stop the process ctrl+c')