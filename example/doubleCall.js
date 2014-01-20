var chainr = require('../');

chainr()
    .seq(function (cb) {
        console.log('1');
        setTimeout(function () {
            cb();
            cb();
        }, 100);
    })
    .seq(function (cb) {
        console.log('2');
        setTimeout(cb, 100);
    })
    .seq(function (cb) {
        console.log('3');
        setTimeout(cb, 100);
    });