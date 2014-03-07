var util = require('util');

var ExecutionContext = require('./ExecutionContext');

function ParallelExecutionContext() {
    ExecutionContext.apply(this, arguments);
}
util.inherits(ParallelExecutionContext, ExecutionContext);

ParallelExecutionContext.prototype.execute = function (error, executeCallback) {
    var that = this;
    var callsToExecute = this._calls.length;

    this._calls.forEach(function (call) {
        var currentErrorState = null;

        call.fn()(function (error) {
            callsToExecute--;

            if (currentErrorState) return;

            if (error) {
                currentErrorState = error;
                return executeCallback(error);
            }

            if (callsToExecute < 0) {
                throw new Error('callback has been called multiple times');
            }

            that._chain.addToContext(call.name(), Array.prototype.slice.call(arguments, 1));

            if (callsToExecute === 0) {
                return executeCallback();
            }
        });
    });
};

module.exports = ParallelExecutionContext;