'use strict'
const moment = require('moment');
const Scheduler = require('../src');
const DIC = require('../src/config')
const sch = new Scheduler();
const {expect} = require('chai');

describe('run task every 1 second for 3 seconds', function () {
  this.timeout(4000);

  it('should pass', function (done) {

    const task = {
      title: 'example',
      status: 'PENDING',
      fn: () => console.log('repeat task, success', new Date()),
      onFailed: (e) => console.log(e),
      repeatPeriod: 1000,
      isRepeat: true,
      error: null
    };

    sch.start();

    sch.addTask(task)
    const promise = new Promise((resolve,reject) => {
      setTimeout(() => {
        sch.stop();
        resolve('finish');
      }, 3000)
    });

    promise.then((finish) => {
      const log = sch.getLogByProcessId();
      expect(log.length).to.eql(3);
      expect(log).to.be.an('array');
      expect(log[0]).to.have.property('status');
      expect(log[0].status).to.eql(DIC.statuses.success);
      expect(log[1].status).to.eql(DIC.statuses.success);      
      done();
    }).catch((e)=>console.log('error',e));
 
  })
})

