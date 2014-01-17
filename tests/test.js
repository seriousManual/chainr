var expect = require('chai').expect;

var chainr = require('../');

describe('Chainr', function() {
    it('should call in sequence', function(done) {
        var order = [];

        chainr()
            .seq(function(cb) {
                order.push('a');

                setTimeout(cb, 100);
            })
            .seq(function(cb) {
                order.push('b');

                setTimeout(cb, 100);
            })
            .seq(function(cb) {
                order.push('c');

                expect(order).to.deep.equal(['a', 'b']);
                done();
            });
    });

    it('should call in parallel', function(done) {
        var order = [];

        chainr()
            .par(function(cb) {
                setTimeout(function() {
                    order.push('a');

                    cb();
                }, 200);
            })
            .par(function(cb) {
                setTimeout(function() {
                    order.push('b');

                    cb();
                }, 100);
            })
            .par(function(cb) {
                setTimeout(function() {
                    order.push('c');

                    cb();
                }, 50);
            })
            .seq(function() {
                order.push('last');

                expect(order).to.deep.equal(['c', 'b', 'a', 'last']);

                done();
            });
    });
});