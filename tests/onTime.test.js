'use strict'
const moment = require('moment');
const Scheduler = require('../src');
const DIC = require('../src/config');
const sch = new Scheduler();
const {expect} = require('chai');

describe('one time run', function () {
  this.timeout(3000);

  it('should pass', function (done) {

    const task = {
      title: 'example',
      status: 'PENDING',
      fn: () => console.log('one time task run, success', new Date()),
      onFailed: (e) => console.log(e),
      repeatPeriod: 1000,
      isRepeat: false,
      error: null
    };

    sch.start();

    sch.addTask(task)
    const promise = new Promise((resolve,reject) => {
      setTimeout(() => {
        sch.stop();
        resolve('finish');
      }, 2500)
    });

    promise.then((finish) => {
      const log = sch.getLogByProcessId();
      expect(log.length).to.eql(1);
      expect(log).to.be.an('array');
      expect(log[0]).to.have.property('status');
      expect(log[0].status).to.eql(DIC.statuses.complete);
      done();
    }).catch((e)=>console.log('error',e));
 
  })
})