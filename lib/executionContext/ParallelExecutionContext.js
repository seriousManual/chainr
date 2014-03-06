var util = require('util');

var ExecutionContext = require('./ExecutionContext');

function ParallelExecutionContext() {
    ExecutionContext.apply(this, arguments);
}
util.inherits(ParallelExecutionContext, ExecutionContext);

module.exports = ParallelExecutionContext;