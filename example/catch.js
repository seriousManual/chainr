var chainr = require('../');

chainr()
    .seq(function (cb) {
        cb(new Error('foo'));
    })
    .seq(function (cb) {
        console.log('2');
        cb();
    })
    .catch(function (error, cb) {
        console.log(error);
        cb(error);
    })
    .catch(function(error, cb) {
        console.log(error);
        cb();
    })
    .seq(function() {
        console.log('final');
    });