function Chainr() {
    
}

Chainr.prototype.seq = function() {
    return this;
};

Chainr.prototype.par = function() {
    return this;
};

Chainr.prototype.catch = function() {
    return this;
};

module.exports = Chainr;