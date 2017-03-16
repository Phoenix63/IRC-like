class Caller {
    constructor(callback) {
        this._callback = function() {
            setTimeout(callback, 300);
        };
        this._saved = 0;
        this._toSave = 0;
    }

    set toSave(val) {
        this._toSave = val;
        if(val <= 0 || this._saved === this._toSave) {
            this._callback();
            delete this;
        }
    }

    incSaved() {
        this._saved++;
        if(this._saved === this._toSave) {
            this._callback();
        }
    }
}

export default Caller;