# Chainr [![Build Status](https://travis-ci.org/seriousManual/chainr.png)](https://travis-ci.org/seriousManual/chainr)

[![NPM](https://nodei.co/npm/chainr.png)](https://nodei.co/npm/chainr/)

[![NPM](https://nodei.co/npm-dl/chainr.png?months=3)](https://nodei.co/npm/chainr/)

Simple flow control library inspired by [seq](https://npmjs.org/package/seq) by substack and [async](https://npmjs.org/package/async) by caolan.

The interface is quite similar but with a reduced function range.
Instead of using the `this` property to assign a done-callback the traditional node way is used (a callback function as the last parameter).

## Installation

````bash
npm install chainr
````

## API

### .seq(cb)
### .seq(name, cb)
Functions registered via `.seq` are executed in sequential order.
Each `cb` gets a callback assigned which is used to signal the end of the callback execution.
If name is specified, the second argument sent to `cb` goes to `chain.var`.

#### example/seq.js
```javascript
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

        console.log(chain.vars);
    });
```
Output:
```
1
2
3
{ foo: 'bar' }
```

### .par(cb)
### .par(name, cb)
Functions registered via `.par` are executed in parallel.
Each `cb` gets a callback assigned which is used to signal the end of the callback execution.
If name is specified, the second argument sent to `cb` goes to `chain.var`.

#### example/par.js

```javascript
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
```
Output:
```
1.3
1.2
1.1
{ foo: 'bar' }
```

### .one(cb)
### .one(name, cb)
Functions registered via `.one` are executed in parallel.
`one` acts equally as `par` with the distinction that it does not wait for all callbacks to execute, one call is sufficient.
Each `cb` gets a callback assigned which is used to signal the end of the callback execution.
If name is specified, the second argument sent to `cb` goes to `chain.var`. (Notice that not every value might be in there!)

#### example/one.js

```javascript
var chainr = require('../');

var order = [];
var chain = chainr();

chain
    .one(function(cb) {
        setTimeout(function() {
            console.log('1.1');
            order.push('1.1');
            cb();
        }, 1000);
    })
    .one(function(cb) {
        setTimeout(function() {
            console.log('1.2');
            order.push('1.2');
            cb();
        }, 400);
    })
    .one(function(cb) {
        setTimeout(function() {
            console.log('1.3');
            order.push('1.3');
            cb();
        }, 100);
    })
    .seq(function (cb) {
        console.log(order);
    });
```
Output:
```
1.3
1.2
1.1
['1.1']
```

### .catch(cb)
When in a sequential or parallel context a callback gets an error object assigned, the execution steps over all pending steps and skips to the next `catch` block.
The catch block than receives the error and an callback that can be used to continue with the execution or to rethrow the error.

#### example/catch.js

```javascript
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
```
Output:
```
[Error: foo]
[Error: foo]
final
```
