var util = require('util');

function ExecutionContext(chain) {
    this._calls = [];
    this._chain = chain;
}

ExecutionContext.prototype.push = function (name, fn) {
    this._calls.push([name, fn]);

    return this;
};

//TODO: move the execution part to the child class, so that each implementation cares about the point in time when the overall callback should be called

//TODO: allow for anonymous adding of results to the context

ExecutionContext.prototype.execute = function (error, executeCallback) {
    var that = this;
    var callsToExecute = this._calls.length;

    this._calls.forEach(function (call) {
        var name = call[0];
        var fn = call[1];
        var currentErrorState = null;

        var callback = function (error) {
            callsToExecute--;

            if(currentErrorState) return;

            if(error) {
                currentErrorState = error;
                return executeCallback(error);
            }

            if (callsToExecute < 0) {
                throw new Error('callback has been called multiple times');
            }

            if(name && arguments.length > 1) {
                that._chain.addToContext(name, arguments[1]);
            }

            if (callsToExecute === 0) {
                return executeCallback();
            }
        };

        if(error) {
            fn(error, callback);
        } else {
            fn(callback);
        }
    });
};

//---------------------------------------------------------------------

function ParallelExecutionContext() {
    ExecutionContext.apply(this, arguments);
}
util.inherits(ParallelExecutionContext, ExecutionContext);

//---------------------------------------------------------------------

function SequentialExecutionContext() {
    ExecutionContext.apply(this, arguments);
}
util.inherits(SequentialExecutionContext, ExecutionContext);

//---------------------------------------------------------------------

function CatchExecutionContext() {
    ExecutionContext.apply(this, arguments);
}
util.inherits(CatchExecutionContext, ExecutionContext);

//---------------------------------------------------------------------

module.exports = {
    SequentialExecutionContext: SequentialExecutionContext,
    ParallelExecutionContext: ParallelExecutionContext,
    CatchExecutionContext: CatchExecutionContext
};