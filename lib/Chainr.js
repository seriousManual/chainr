var ExecutionContext = require('./ExecutionContext');

function Chainr() {
    this._order = [];
    this._currentItem = 0;
    this._running = false;
}

Chainr.prototype.run = function () {
    if (this._running) return;

    this._running = true;

    this._runNext();
};

Chainr.prototype._runNext = function() {
    this._order[this._currentItem].execute(this._runNext.bind(this));

    this._currentItem++;
};

Chainr.prototype.seq = function (name, fn) {
    if (typeof name === 'function') {
        fn = name;
        name = null;
    }

    this._order.push(new ExecutionContext.SequentialExecutionContext(name, fn));

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
        var tmp = new ExecutionContext.ParallelExecutionContext(name, fn);
        tmp.push(name, fn);
        this._order.push(tmp);
    }

    return this;
};

Chainr.prototype.catch = function () {
    return this;
};

Chainr.prototype._peek = function () {
    return this._order.length > 0 ?
        this._order[this._order.length - 1] :
        null;
};

module.exports = Chainr;