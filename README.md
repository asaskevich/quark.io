quark.io - minimalistic web framework for Node.js
======
[![npm version](https://badge.fury.io/js/quark.io.svg)](http://badge.fury.io/js/quark.io)

**quark.io** is the minimalistic web framework for creating small and beautiful HTTP servers.

#### Main features
* Small number of 3rd party dependencies
* Easy routing
* Jade support
* Static file serving
* Middleware support

#### Installation
Just run `npm install quark.io`

#### Hello World Server

```js
var quark = require('./quark.io');

var app = new quark({
    port: 3002
});

app.get('/', function(req, res) {
    res.ok('Hello, World!')
});

app.start();
```

#### More examples
For more examples look at the `examples` directory of the repository.

#### Creating a new server

```js
var quark = require('./quark.io');

var app = new quark({
    port: 3002, // Listening port, by default 8888
    debug: true, // Debug mode, will produce more output to the logger
    statics: ['public/', 'uploads/'], // Static directories, this array by default empty.
    logger: < Any logger that has similar methods as console >, // By default output goes to the console
    renderTemplate: < Any callback function that acts as 'jade.render' >, // By default used 'jade.render'
    renderFile: < Any callback function that acts as 'jade.renderFile' >, // By default used 'jade.renderFile'
});
```

#### Routing

Simple routes:

```js
app.get('/', function(req, res) { ... });
app.post('/user/save', function(req, res) { ... });
app.put('/user/update', function(req, res) { ... });
app.delete('/user/remove', function(req, res) { ... });
```

Routes with arguments (argument names in the route **should be** the same as the function's arguments' names):

```js
app.get('/topics/:topicId/message/:message', function(req, res, topicId, message) { ... });
app.post('/user/:userId/send/:message', function(req, res, userId, message) { ... });
```

#### Middleware

```js
function middleware(req, res) {
    console.log('Middleware active!');
};

function anotherMiddleware(req, res) {
    console.log('Another middleware active!');
};

app.get('/', function(req, res) { ... }, middleware, anotherMiddleware);
```

#### Requests and responses
Requests and responses are fully compatible with the native node.js implementation. But the response object has some additional methods:

```js
res.send(data, [code, [headers]]);
res.fail(data, [headers]);
res.ok(data, [headers]);
res.text(data, [headers]);
res.html(data, [headers]);
res.json(data, [headers]);
res.redirect(data, [redirectUrl, [headers]]);
res.render(template, options);
res.renderFile(fileName, options);
```

#### Performance
Framework's performance tested with Apache Benchmark (all scripts and results inside `benchmark/` directory).

![Results](benchmark/benchmark.png)

#### Support
If you do have a contribution for the package feel free to make a pull request or open an issue.


[![NPM](https://nodei.co/npm/quark.io.png)](https://nodei.co/npm/quark.io/)
