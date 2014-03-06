var util = require('util');

var ExecutionContext = require('./ExecutionContext');

function CatchExecutionContext() {
    ExecutionContext.apply(this, arguments);
}
util.inherits(CatchExecutionContext, ExecutionContext);

module.exports = CatchExecutionContext;