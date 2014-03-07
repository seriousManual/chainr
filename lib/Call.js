function Call(name, fn) {
    this._name = name;
    this._fn = fn;
}

Call.prototype.name = function() {
    return this._name;
};

Call.prototype.fn = function() {
    return this._fn;
};

module.exports = Call;