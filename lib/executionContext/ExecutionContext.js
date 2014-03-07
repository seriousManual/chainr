function ExecutionContext(chain) {
    this._calls = [];
    this._chain = chain;
}

ExecutionContext.prototype.push = function (call) {
    this._calls.push(call);

    return this;
};

ExecutionContext.prototype.execute = function (error, executeCallback) {
    throw new Error('has to be implemented by child');
};

module.exports = ExecutionContext;