var util = require('util');

var ExecutionContext = require('./ExecutionContext');

function SequentialExecutionContext() {
    ExecutionContext.apply(this, arguments);
}
util.inherits(SequentialExecutionContext, ExecutionContext);

module.exports = SequentialExecutionContext;