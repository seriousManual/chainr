var ExecutionContext = require('./executionContext');

function Chainr() {
    this._order = [];
    this._currentItem = 0;
    this._running = false;
    this.vars = {};
}

Chainr.prototype.run = function () {
    if (this._running) return;

    this._running = true;

    this._callNext(null, this._getNext.bind(this));
};

Chainr.prototype.seq = function (name, fn) {
    if (typeof name === 'function') {
        fn = name;
        name = null;
    }

    this._order.push(new ExecutionContext.SequentialExecutionContext(this).push(name, fn));

    return this;
};

Chainr.prototype.par = function (name, fn) {
    if (typeof name === 'function') {
        fn = name;
        name = null;
    }

    var last = this._peek();
    if (last instanceof ExecutionContext.ParallelExecutionContext) {
        last.push(name, fn);
    } else {
        this._order.push(new ExecutionContext.ParallelExecutionContext(this).push(name, fn));
    }

    return this;
};

Chainr.prototype.catch = function (fn) {
    this._order.push(new ExecutionContext.CatchExecutionContext(this).push(null, fn));

    return this;
};

Chainr.prototype.addToContext = function (name, value) {
    this.vars[name] = value;
};

Chainr.prototype._callNext = function (error, nextProvider) {
    var that = this;
    var next = nextProvider();

    if (next) {
        var errorArgument = error || null;

        next.execute(errorArgument, function (error) {
            if (error) return that._callNext(error, that._getNextCatch.bind(that));

            that._callNext(null, that._getNext.bind(that));
        });

        return;
    }

    if (error) throw new Error('uncatched error: "' + error.message + '"');
};

Chainr.prototype._peek = function () {
    return this._order.length > 0 ?
        this._order[this._order.length - 1] :
        null;
};

Chainr.prototype._getNext = function () {
    return this._iterator(Chainr._isNotCatch);
};

Chainr.prototype._getNextCatch = function () {
    return this._iterator(Chainr._isCatch);
};

Chainr.prototype._iterator = function (checker) {
    var next = this._order[this._currentItem];
    this._currentItem++;

    if (!next) return null;
    if (!checker(next)) return this._iterator(checker);

    return next;
};

Chainr._isCatch = function(fn) {
    return fn instanceof ExecutionContext.CatchExecutionContext;
};

Chainr._isNotCatch = function(fn) {
    return !(fn instanceof ExecutionContext.CatchExecutionContext);
};

module.exports = Chainr;