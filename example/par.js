var chainr = require('../');

chainr()
    .par(function(cb) {
        console.log('1.1');
        setTimeout(cb, 400);
    })
    .par(function(cb) {
        console.log('1.2');
        setTimeout(cb, 600);
    })
    .par(function(cb) {
        console.log('1.3');
        setTimeout(cb, 1000);
    })
    .seq(function (cb) {
        console.log('2');
        setTimeout(cb, 100);
    });