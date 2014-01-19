var ExecutionContext = require('./ExecutionContext');

function Chainr() {
    this._order = [];
}

Chainr.prototype.seq = function(name, fn) {
    if(typeof name === 'function') {
        fn = name;
        name = null;
    }



    return this;
};

Chainr.prototype.par = function() {
    return this;
};

Chainr.prototype.catch = function() {
    return this;
};

module.exports = Chainr;