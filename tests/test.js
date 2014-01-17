var expect = require('chai').expect;

var chainr = require('../');

describe('Chainr', function() {
    it('should call in sequence', function(done) {
        var order = [];

        chainr()
            .seq(function(cb) {
                order.push('a');

                setTimeout(cb, 200);
            })
            .seq(function(cb) {
                order.push('b');

                setTimeout(cb, 100);
            })
            .seq(function(cb) {
                order.push('c');

                expect(order).to.deep.equal(['a', 'b', 'c']);
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

    it('should add the supplied values to the chain.vars object', function(done) {
        var chain = chainr();

        chain.seq('foo', function(cb) {
            cb(null, 'bar');
        });

        chain.seq('bax', function(cb) {
            cb(null, 'baz');
        });

        chain.seq(function() {
            expect(chain.vars).to.deep.equal({
                foo: 'bar',
                bax: 'baz'
            });

            done();
        })
    });

    it('should not call catch when error occurs', function(done) {
        chainr()
            .seq(function(cb) {
                setTimeout(cb, 100);
            })
            .seq(function(cb) {
                setTimeout(cb, 100);
            })
            .catch(function() {
                expect(false).to.be.true;

                done();
            })
            .seq(function() {
                expect(true).to.be.true;

                done();
            });
    });

    it('should jump to catch when error occurs, should execute subsequential seq, should not intermediate', function(done) {
        var caboomError = new Error('caboom');
        var order = [];

        chainr()
            .seq(function(cb) {
                setTimeout(function() {
                    order.push('a');

                    cb(caboomError)
                }, 100);
            })
            .seq(function(cb) {
                order.push('b');

                setTimeout(cb, 100);
            })
            .catch(function(error, cb) {
                order.push(error);
                cb();
            })
            .seq(function() {
                expect(order).to.deep.equal(['a', caboomError]);

                done();
            });
    });
});