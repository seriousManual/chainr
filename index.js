var Chainr = require('./lib/Chainr');

module.exports = function () {
    var chain = new Chainr();

    process.nextTick(chain.run.bind(chain));

    return chain;
};