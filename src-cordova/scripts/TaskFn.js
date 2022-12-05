/*
* 构造一个 TaskFn
* 来处理要打算进行的任务队列
*
* 打算构建如下属性
* task_arr 打算执行的任务队列
*
* 打算构建如下方法
* start 开始任务
* push  往task_arr推送一个任务
* log   自身log方法，决定是要做log日志，暂时不做
*
* */
let moment = require('moment');
const chalk = require("chalk");

function TaskFn(obj){
    let m = this;
    const {TINGZHU, type} = obj;
    m.task_arr = [];
    m.type = type;
    m.success_arr = [];
    m.fail_arr = [];
    m.name = TINGZHU;
    m.next = m.next.bind(this);
    return m;
};

TaskFn.prototype.push = function(taskObj){
    this.task_arr.push(taskObj);
    return this;
};

TaskFn.prototype.start = function() {
    console.log(chalk.bold.green(`开始打包${this.name}任务`));
    let startTime = moment();
    this.startTime = startTime;
    this.log(`任务开始时间：`+ startTime.format('YYYY-MM-DD HH:mm:ss'));
    this.next();
};

TaskFn.prototype.log = function(str) {
    console.log(str);
};

TaskFn.prototype.next = function(){
    const _self = this;
    if(this.type === 'build:all'){
        this.log(`剩余任务数：${_self.task_arr.length}`);
    }
    if(this.task_arr.length > 0){
        // 根据 nowTask，决定要运行何种类型命令
        let nowTask = this.task_arr.shift();
        runOneTask(nowTask, _self);
    }else{
        let endTime = moment();
        this.endTime = endTime;
        this.log(`任务结束时间：`+endTime.format('YYYY-MM-DD HH:mm:ss'));
        console.log(chalk.bold.green(`打包${this.name}任务成功`));
        let spendTime = (this.endTime-this.startTime)/1000+'秒';
        if(this.type === 'build:all'){
            console.log(chalk.bold(`========================================================`));
            console.log(`任务开始时间：`+ this.startTime.format('YYYY-MM-DD HH:mm:ss'));
            console.log(`任务结束时间：`+ this.endTime.format('YYYY-MM-DD HH:mm:ss'));
            console.log(chalk.bold.green(`成功的任务：`+this.success_arr));
            console.log(chalk.red.green(`失败的任务：`+this.fail_arr));
            console.log(chalk.bold.green(`任务消耗时长：`+ spendTime));
            console.log(chalk.bold(`========================================================`));
        }
    }
    return this;
};

/*
* runOneTask  跑单个任务的方法
*
* nowTask        [Object]     代表了当前任务对象
* nowTask.type   [String]     任务是同步、异步类型  "sync" 同步 "async" 异步
* nowTask.des    [String]     任务描述，说明当前任务打算做什么
* nowTask.todoFn [Function]   任务真正要执行的函数
* self 代表了TaskApks对象
* */
function runOneTask(nowTask, self){
    const {type, des, todoFn} = nowTask;
    self.log('正在进行:'+des);
    if(type === 'sync'){
        // 同步
        todoFn(self.next, self);
    }else{
        // 异步
        todoFn();
        self.next();
    }
};

module.exports = TaskFn;

