const moment = require('moment');
const { tasks, log } = require('./tasks_db');
const DIC = require('./config');
const { taskTimeToDic, nextInvoikeAt } = require('./helpers');
const InfiniteLoop = require('infinite-loop');
const il = new InfiniteLoop();

const init = () => {
    const checkForTask = () => {
        const copy = (obj) => Object.assign({copy_time: new Date()},obj);

        const current_time = moment();
        const task_loc = taskTimeToDic(current_time);
        let tasks_to_executed = tasks[task_loc];
        
        tasks_to_executed = tasks_to_executed.filter((task) => {
            if (task.time.diff(current_time) < DIC.accuracy  && task.time.diff(current_time)  > -DIC.accuracy) {
                return true;
            } 

           return false;            
        });
    
        if (tasks_to_executed.length === 0) {
            return;
        }

        const idx_arr = [];
        for (let i = 0; i < tasks_to_executed.length; i++) {
            const task = tasks_to_executed[i];
            
            try {
                if (task.status !== DIC.statuses.pending) {
                    throw new Error('task status error:' + task.status);
                }
    
                task.fn();
                if (!task.isRepeat) {
                    task.status = DIC.statuses.complete;
                    log.push(copy(task));
                    idx_arr.push(i);
                } else {
                    task.status = DIC.statuses.success;
                    log.push(copy(task));
                    task.status = DIC.statuses.pending;
                    task.time = nextInvoikeAt(task.date,task.repeatPeriod ,task.isRepeat);
                }            
            } catch (error) {
                task.status = DIC.statuses.failed;
                task.error = error;
                log.push(copy(task));
                try {
                    task.status = DIC.statuses.success;
                    task.onFailed(error);  
                    log.push(copy(task));
                } catch (error) {
                    task.error = error;
                    log.push(copy(task));
                }
                
            }
        }
        
        tasks[task_loc] = tasks_to_executed.filter((task, i)=> idx_arr.indexOf(i) === -1)
        
    };

    il.add(checkForTask);
    il.setInterval(DIC.interval);
    
    return il;
}


module.exports = {
    init
};