var chainr = require('../');

chainr()
    .par(function(cb) {
        setTimeout(function() {
            console.log('1.1');
            cb();
        }, 1000);
    })
    .par(function(cb) {
        setTimeout(function() {
            console.log('1.2');
            cb();
        }, 400);
    })
    .par(function(cb) {
        setTimeout(function() {
            console.log('1.3');
            cb();
        }, 100);
    })
    .seq(function (cb) {
        console.log('2');
        setTimeout(cb, 100);
    });