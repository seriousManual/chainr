var chainr = require('../');

chainr()
    .par(foo(500))
    .par(foo(900))
    .par(foo(1300))
    .seq(function (cb) {
        console.log( 'wurst' );
    });

function foo(duration) {
    return function(cb) {
        setTimeout(function() {
            console.log( duration );
            cb();
        }, duration);
    };
}