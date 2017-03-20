class Trigger {
    constructor(callback, numberOfAsyncTasks) {
        this._callback = callback;
        this._asyncTasksPerformed = 0;
        this._numberOfTasks = numberOfAsyncTasks;
    }
    perform() {
        this._asyncTasksPerformed++;
        if(this._asyncTasksPerformed === this._numberOfTasks) {
            this._callback();
        }
    }
    addAsyncTask(i) {
        this._numberOfTasks += i;
    }
    removeAsyncTask(i){
        this._numberOfTasks -= i;
        if(this._numberOfTasks === 0){
            this._callback();
        }
    }
}
export default Trigger;