var chainr = require('../');

var chain = chainr();

chain
    .seq('foo', function (cb) {
        console.log('1');
        setTimeout(cb.bind(null, null, 'bar'), 100);
    })
    .seq(function (cb) {
        console.log('2');
        setTimeout(cb, 100);
    })
    .seq(function (cb) {
        console.log('3');

        console.log( chain.vars );
    });