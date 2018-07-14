let {tasks, log} = require('./tasks_db');
const schedulerLoop = require('./scheduler');
const {taskTimeToDic, tasksToArr, nextInvoikeAt, generateId} = require('./helpers');
const DIC = require('./config');
const moment = require('moment');

class Scheduler {
    constructor() {
        this.timer = null;
        this.processId = generateId();
        this.db = {
            tasks,
            log
        };
    }

    get log() {
        return this.db.log;
    }

    get tasks() {
        return tasksToArr(this.db.tasks);
    }

    getLogByProcessId(id) {
        id = id ||  this.processId;
        return this.db.log.filter(l => l.processId === id)
    }

    _locStringToIdx(locString) {
        const loc = locString.substr(0,locString.indexOf('-'));
        const idx = locString.substr(Number(locString.indexOf('-')) + 1,locString.length);

        return { loc, idx};
    }

    _addTask(task, idx) {
        const defaultFn = () => console.log('default task success run');
        const defaultFailed = (e) => console.log('default task error run', e);
        
        try {
            const _task = {
                title: task.title || 'NO TITLE',
                status: DIC.statuses.pending,
                fn: task.fn || defaultFn,
                onFailed: task.onFailed || defaultFailed,
                date: task.date || null,
                time: nextInvoikeAt(task.date, task.repeatPeriod, task.isRepeat, true),
                repeatPeriod: task.repeatPeriod || null,
                isRepeat: task.isRepeat,
                error: null,
                processId: this.processId
            };

            const task_loc = taskTimeToDic(_task.time);

            if(Number.isInteger(idx)) {
                this.db.tasks[task_loc][idx] = _task;
            } else {
                this
                .db
                .tasks[task_loc]
                .push(_task);
            }           

            return `${task_loc}-${tasks[task_loc].length - 1}`
        } catch (error) {
            console.log('_addTask error')
            return error.message;
        }
    };

    addTask(task) {
        if (task.length) {
           return task.map((t) => this._addTask(t));
        }
        else {
            return this._addTask(task)
        }
    }

    deleteTask(locString) {
        const { loc, idx } = this._locStringToIdx(locString);

        this.db.tasks[loc].splice(idx,1);
    };

    updateTask(locString, task) {
        const { idx } = this._locStringToIdx(locString);

        return this._addTask(task, idx);
    };

    stop() {
        this.il.removeInterval();
        this.il.stop();
    };

    start() {      
        this.il = schedulerLoop.init();
        this.il.run();
    };

    clear(){
        for (const key in this.db.tasks) {
            this.db.tasks[key] = [];
        }        
       this.db.log = [];
       log = this.db.log;
       tasks = this.db.tasks;
    }
}

module.exports = Scheduler;
