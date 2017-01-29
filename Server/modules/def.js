Object.defineProperty(global, '__stack', {
    get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__lineError', {
    get: function() {
        return __stack[1].getLineNumber();
    }
});

Object.defineProperty(global, '__callerName', {
    get: function() {
        return __stack[1].getFunctionName().replace('module.exports.', '');
    }
});