function chainr() {
    var chain = {
        seq: function (name, fn) {
            return chain;
        },
        par: function (name, fn) {
            return chain;
        },
        catch: function (fn) {
            return chain;
        }
    };

    return chain;
}

module.exports = chainr;