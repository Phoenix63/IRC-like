class Caller {
    constructor(callback) {
        this._callback = callback;
        this._saved = 0;
        this._toSave = 0;
    }

    set toSave(val) {
        if(val <= 0) {
            this._callback();
            delete this;
        }
        this._toSave = val;
    }

    incSaved() {
        this._saved++;
        if(this._saved === this._toSave) {
            this._callback();
        }
    }
}

export default Caller;