const moment = require('moment');
const crypto = require('crypto');

module.exports = {
    taskTimeToDic: (time) => time.hours(),
    tasksToArr: (tasks={}) => {
        let _tasks = [];
        for (const key in tasks) {
            _tasks.push(...tasks[key]);
        }

        return _tasks;
    },
     nextInvoikeAt : (date={}, repeatPeriod, isRepeat, isFirst=false) => {
         if (isFirst) {
             return isRepeat && repeatPeriod ? moment().add(repeatPeriod, 'milliseconds') : moment(date.dateString, date.format);
         } else {
            return isRepeat && repeatPeriod ? moment().add(repeatPeriod, 'milliseconds') : moment(date.dateString, date.format).add(1, 'days');
         }         
     },
     generateId() {
        const current_date = (new Date()).valueOf().toString();
        const random = Math.random().toString();
        return crypto.createHash('sha1').update(current_date + random).digest('hex');
     }
}