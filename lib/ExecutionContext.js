var util = require('util');

function ExecutionContext() {
    this._calls = [];
}

ExecutionContext.prototype.push = function(name, fn) {
    this._calls.push([name, fn]);
};

ExecutionContext.prototype.execute = function(callback) {
    var callsToExecute = this._calls.length;

    this._calls.forEach(function(call) {
        var name = call[0];
        var fn = call[1];

        fn(function(error) {
            callsToExecute--;

            if(callsToExecute === 0) {
                return callback();
            }

            if(callsToExecute < 0) {
                //TODO: throw (cb has been called multiple times)
            }
        });
    });
};

//---------------------------------------------------------------------

function ParallelExecutionContext() {
    ExecutionContext.call(this);
}
util.inherits(ParallelExecutionContext, ExecutionContext);

//---------------------------------------------------------------------

function SequentialExecutionContext(name, fn) {
    ExecutionContext.call(this);

    this.push(name, fn);
}
util.inherits(SequentialExecutionContext, ExecutionContext);




module.exports = {
    SequentialExecutionContext: SequentialExecutionContext,
    ParallelExecutionContext: ParallelExecutionContext
};