var util = require('util');

var ExecutionContext = require('./ExecutionContext');

function OneExecutionContext() {
    ExecutionContext.apply(this, arguments);
}
util.inherits(OneExecutionContext, ExecutionContext);

OneExecutionContext.prototype.execute = function (error, executeCallback) {
    var that = this;

    var called = false;

    this._calls.forEach(function (call) {
        call.fn()(function (error) {
            if (called) return;

            called = true;

            if (error) return executeCallback(error);

            if (call.name() && arguments.length > 1) {
                that._chain.addToContext(call.name(), arguments[1]);
            }

            return executeCallback();
        });
    });
};

module.exports = OneExecutionContext;