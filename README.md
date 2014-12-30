quark.io - minimalistic web framework for Node.js
======
**quark.io** is the minimalistic web framework for creating small and beautiful HTTP servers.

#### Main features
* Less dependencies from others packages
* Easy routing
* Jade support
* Static files
* Middleware

#### Installation
Just do `npm install quark.io`

#### Hello World Server
```js
var quark = require('quark.io');
var quark = new quark();

quark.get('/', function (req, res) {
    res.ok("Hello, World!");
});

quark.listen(3002);
```

#### Creating new routes
* `quark.get(route, function(req, res, [params]) { ... })`
* `quark.post(route, function(req, res, [params]) { ... })`
* `quark.put(route, function(req, res, [params]) { ... })`
* `quark.delete(route, function(req, res, [params]) { ... })`

Routes use params, which can be defined in route, like this `/user/:id`. Params will be passed to callback as `{ id: ... }`.

#### Middleware
When you create new routes, you can pass array of `function(req, res) { ... }` or one `function(req, res) { ... }` that will be used as middleware for defined route.
For example:
```js
quark.get("/", function (req, res) {
    res.ok("Hello, World!");
}, function (req, res) {
    console.log("Middleware active!");
});
```

#### Requests and responses
Requests and responses are fully compatible with native node.js implementation. But response has some new features:

```js
res.send(data, [code, [headers]]);
res.fail(data, [headers]);
res.ok(data, [headers]);
res.text(data, [headers]);
res.html(data, [headers]);
res.json(data, [headers]);
res.redirect(data, [redirectUrl, [headers]]);
res.render(template, options, [ownRender]);
res.renderFile(fileName, options, [ownFileRender]); // fileName is relative path to the working directory
```

#### Using custom template engines
By default, **quark.io** uses Jade as primary template engine. If you want to use own, you can pass `render` and `renderFile` callbacks to the `res.render` and `res.renderFile`.

#### Static files
```js
quark.staticFiles(dir);
```
Will use `dir` as the static file directory.

#### Some arguments
```js
    quark.port = 8888; // Default listened port
    quark.printErrors = true; // Will print stack traces for generated errors
    quark.server; // Native Node.js server
```
