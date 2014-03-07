var util = require('util');

var ExecutionContext = require('./ExecutionContext');

function CatchExecutionContext() {
    ExecutionContext.apply(this, arguments);
}
util.inherits(CatchExecutionContext, ExecutionContext);

CatchExecutionContext.prototype.execute = function (error, executeCallback) {
    var call = this._calls[0];
    var calledBefore = false;

    call.fn()(error, function (error) {
        if (error) return executeCallback(error);
        if (calledBefore) throw new Error('callback has been called multiple times');

        calledBefore = true;

        return executeCallback();
    });
};

module.exports = CatchExecutionContext;