var Chainr = require('./lib/Chainr');

module.exports = function () {
    var chain = new Chainr();

    setImmediate(chain.run.bind(chain));

    return chain;
};