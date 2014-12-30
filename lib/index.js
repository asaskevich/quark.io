var http = require('http');
var colors = require('colors');
var routers = require('./routers');
var injector = require('./response_injector');

module.exports = function () {
    // Default port
    this.port = 8888;
    // Debug mode
    this.printErrors = true;
    // Routers defined for this server instance
    this.routers = new routers();
    this.get = function (route, callback, middlewares) {
        var insertedRoute = {"GET": {}};
        insertedRoute.GET[route] = callback;
        this.routers.add(insertedRoute, middlewares);
    };
    this.post = function (route, callback, middlewares) {
        var insertedRoute = {"POST": {}};
        insertedRoute.POST[route] = callback;
        this.routers.add(insertedRoute, middlewares);
    };
    this.put = function (route, callback, middlewares) {
        var insertedRoute = {"PUT": {}};
        insertedRoute.PUT[route] = callback;
        this.routers.add(insertedRoute, middlewares);
    };
    this.delete = function (route, callback, middlewares) {
        var insertedRoute = {"DELETE": {}};
        insertedRoute.DELETE[route] = callback;
        this.routers.add(insertedRoute, middlewares);
    };
    this.staticFiles = function (dir) {
        this.routers.useStatic(dir);
    };
    this.listen = function (port) {
        var that = this;
        var _port = port || that.port;
        that.server = http.createServer(function (req, res) {
            console.time("\tTime".cyan);
            try {
                that.routers.callRoute(req.url, req.method, req, injector.inject(res));
            } catch (exception) {
                if (that.printErrors) console.error(exception.stack);
                that.routers.serverErrors(req, res, exception);
            }
            console.info(req.method.cyan, req.url);
            console.timeEnd("\tTime".cyan);
        });
        that.server.listen(_port);
        console.log('Server started on port', (_port + "").green, '\nWaiting for connections...');
    };
};