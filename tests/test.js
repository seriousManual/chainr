var domain = require('domain');

var expect = require('chai').expect;

var chainr = require('../');

describe('Chainr', function () {
    it('should call in sequence', function (done) {
        var order = [];

        chainr()
            .seq(function (cb) {
                order.push('a');

                setTimeout(cb, 20);
            })
            .seq(function (cb) {
                order.push('b');

                setTimeout(cb, 5);
            })
            .seq(function (cb) {
                order.push('c');

                expect(order).to.deep.equal(['a', 'b', 'c']);
                done();
            });
    });

    it('should call in parallel', function (done) {
        var order = [];

        chainr()
            .par(function (cb) {
                setTimeout(function () {
                    order.push('a');

                    cb();
                }, 30);
            })
            .par(function (cb) {
                setTimeout(function () {
                    order.push('b');

                    cb();
                }, 20);
            })
            .par(function (cb) {
                setTimeout(function () {
                    order.push('c');

                    cb();
                }, 5);
            })
            .seq(function () {
                order.push('last');

                expect(order).to.deep.equal(['c', 'b', 'a', 'last']);
                done();
            });
    });

    describe('internal value holder', function () {
        it('should add the supplied values to the chain.vars object', function (done) {
            var chain = chainr();

            chain
                .seq('foo', function (cb) {
                    setTimeout(cb.bind(null, null, 'bar'), 20);
                })
                .seq('bax', function (cb) {
                    setTimeout(cb.bind(null, null, 'baz'), 20);
                })
                .seq(function () {
                    expect(chain.vars).to.deep.equal({
                        foo: 'bar',
                        bax: 'baz'
                    });

                    done();
                });
        });

        it('should not put values into the internal value holder when no name is present', function (done) {
            var chain = chainr();

            chain
                .seq(function (cb) {
                    setTimeout(cb.bind(null, null, 'bar'), 20);
                })
                .seq(function () {
                    expect(chain.vars).to.deep.equal({});

                    done();
                });
        });

        it('should add the supplied values to the chain.vars object', function (done) {
            var chain = chainr();

            chain
                .par('foo', function (cb) {
                    setTimeout(cb.bind(null, null, 'bar'), 20);
                })
                .par('bax', function (cb) {
                    setTimeout(cb.bind(null, null, 'baz'), 1);
                })
                .seq(function () {
                    expect(chain.vars).to.deep.equal({
                        foo: 'bar',
                        bax: 'baz'
                    });

                    done();
                });
        });
    });

    it('should crash on multiple done call', function (done) {
        var testDomain = domain.create();

        testDomain.run(function() {
            chainr()
                .seq(function (cb) {
                    cb();
                    cb();
                });
        });

        testDomain.on('error', function(error) {
            expect(error.message).to.match(/callback has been called multiple times/);

            done();
        });
    });

    describe('error handling', function () {
        it('should not call catch when no error occurs', function (done) {
            chainr()
                .seq(function (cb) {
                    setTimeout(cb, 10);
                })
                .seq(function (cb) {
                    setTimeout(cb, 10);
                })
                .catch(function () {
                    expect(false).to.be.true;

                    done();
                })
                .seq(function () {
                    expect(true).to.be.true;

                    done();
                });
        });

        it('should jump to catch when error occurs, should execute subsequential seq, should execute not intermediate', function (done) {
            var caboomError = new Error('caboom');
            var order = [];

            chainr()
                .seq(function (cb) {
                    setTimeout(function () {
                        order.push('a');

                        cb(caboomError)
                    }, 10);
                })
                .seq(function (cb) {
                    order.push('b');

                    setTimeout(cb, 10);
                })
                .catch(function (error, cb) {
                    order.push(error);

                    cb();
                })
                .seq(function () {
                    expect(order).to.deep.equal(['a', caboomError]);

                    done();
                });
        });

        it('should should throw when no error handler is registered', function (done) {
            var testDomain = domain.create();

            testDomain.run(function() {
                chainr()
                    .seq(function (cb) {
                        cb(new Error('caboom'));
                    });
            });

            testDomain.on('error', function(error) {
                expect(error.message).to.match(/uncatched error/);

                done();
            });
        });

        it('should pass on error', function (done) {
            var caboomError = new Error('caboom');
            var order = [];

            chainr()
                .seq(function (cb) {
                    setTimeout(function () {
                        order.push('a');

                        cb(caboomError)
                    }, 10);
                })
                .catch(function (error, cb) {
                    order.push(error);

                    cb(error);
                })
                .catch(function (error, cb) {
                    order.push(error);

                    cb();
                })
                .seq(function () {
                    expect(order).to.deep.equal(['a', caboomError, caboomError]);

                    done();
                });
        });
    });

    describe.skip('sketchout', function () {
        it('should', function (done) {
            var order = [];

            var chain = chainr();

            chain
                .seq(function (cb) {
                    order.push('a');
                    cb();
                })
                .seq(function (cb) {
                    order.push('b');
                    cb();
                });

            setTimeout(function () {
                chain
                    .seq(function (cb) {
                        order.push('c');
                        cb();
                    })
                    .seq(function (cb) {
                        order.push('d');

                        expect(order).to.deep.equal(['a', 'b', 'c', 'd']);
                        done();
                    });
            }, 200);
        })
    });
});