var util = require('util');

var ExecutionContext = require('./ExecutionContext');

function SequentialExecutionContext() {
    ExecutionContext.apply(this, arguments);
}
util.inherits(SequentialExecutionContext, ExecutionContext);

SequentialExecutionContext.prototype.execute = function (error, executeCallback) {
    var that = this;
    var call = this._calls[0];

    var calledBefore = false;

    call.fn()(function (error) {
        if (error) return executeCallback(error);
        if (calledBefore) throw new Error('callback has been called multiple times');

        calledBefore = true;

        that._chain.addToContext(call.name(), Array.prototype.slice.call(arguments, 1));

        return executeCallback();
    });
};

module.exports = SequentialExecutionContext;