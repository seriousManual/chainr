var chainr = require('../');

var chain = chainr();

chain
    .par(function(cb) {
        setTimeout(function() {
            console.log('1.1');
            cb();
        }, 1000);
    })
    .par('foo', function(cb) {
        setTimeout(function() {
            console.log('1.2');
            cb(null, 'bar');
        }, 400);
    })
    .par(function(cb) {
        setTimeout(function() {
            console.log('1.3');
            cb();
        }, 100);
    })
    .seq(function (cb) {
        console.log(chain.vars);
    });