let counter = 0;
let callback;

class Trigger {
    static update() {
        counter++;
        if (counter === 2) {
            counter = 0;
            callback();
        }
    }

    static setCallback(cb) {
        callback = cb;
    }
}
export default Trigger;