function ExecutionContext(chain) {
    this._calls = [];
    this._chain = chain;
}

ExecutionContext.prototype.push = function (name, fn) {
    this._calls.push([name, fn]);

    return this;
};

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

module.exports = ExecutionContext;