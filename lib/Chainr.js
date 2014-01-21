var ExecutionContext = require('./ExecutionContext');

function Chainr() {
    this._order = [];
    this._currentItem = 0;
    this._running = false;
    this.vars = {};
}

Chainr.prototype.run = function () {
    if (this._running) return;

    this._running = true;

    this._callNext();
};

Chainr.prototype.seq = function (name, fn) {
    if (typeof name === 'function') {
        fn = name;
        name = null;
    }

    var tmp = new ExecutionContext.SequentialExecutionContext(this);
    tmp.push(name, fn);
    this._order.push(tmp);

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
        var tmp = new ExecutionContext.ParallelExecutionContext(this);
        tmp.push(name, fn);
        this._order.push(tmp);
    }

    return this;
};

Chainr.prototype.catch = function (fn) {
    var tmp = new ExecutionContext.CatchExecutionContext(this);
    tmp.push(null, fn);
    this._order.push(tmp);

    return this;
};

Chainr.prototype.addToContext = function (name, value) {
    this.vars[name] = value;
};

Chainr.prototype._callNext = function () {
    var that = this;
    var next = this._getNext();

    if (next) {
        next.execute(null, function (error) {
            if (error) {
                return that._callNextCatch(error);
            }

            that._callNext();
        });
    }
};

Chainr.prototype._callNextCatch = function (error) {
    var that = this;
    var next = this._getNextCatch();

    if (next) {
        next.execute(error, function (error) {
            if (error) {
                return that._callNextCatch(error);
            }

            that._callNext();
        });
    } else {
        throw new Error('uncatched error: "' + error.message + '"');
    }
};

Chainr.prototype._peek = function () {
    return this._order.length > 0 ?
        this._order[this._order.length - 1] :
        null;
};

Chainr.prototype._getNext = function () {
    var next = this._order[this._currentItem];
    this._currentItem++;

    if (!next) return null;
    if (next instanceof ExecutionContext.CatchExecutionContext) return this._getNext();

    return next;
};

Chainr.prototype._getNextCatch = function () {
    var next = this._order[this._currentItem];
    this._currentItem++;

    if (!next) return null;
    if (!(next instanceof ExecutionContext.CatchExecutionContext)) return this._getNextCatch();

    return next;
};

module.exports = Chainr;