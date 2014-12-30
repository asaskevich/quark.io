var urlPattern = require('url-pattern');
var http = require("http");
var _url = require("url");
var path = require("path");
var fs = require("fs");

module.exports = function () {
    this.callbacks = {
        "GET": [],
        "POST": [],
        "PUT": [],
        "DELETE": []
    };
    this.patterns = {
        "GET": [],
        "POST": [],
        "PUT": [],
        "DELETE": []
    };
    this.middlewares = {
        "GET": [],
        "POST": [],
        "PUT": [],
        "DELETE": []
    };
    this.notFound = function (req, res) {
        res.send("Not Found", 404);
    };
    this.serverErrors = function (req, res, exception) {
        res.fail("Some errors on lib.io side!");
    };
    this.useStatic = function (dir) {
        this.staticDirectory = dir;
    };
    this.staticDirectoryCallback = function (url, type, request, response, callback) {
        if (!this.staticDirectory) return callback(url, type, request, response);
        var uri = _url.parse(request.url).pathname;
        var filename = path.join(process.cwd() + this.staticDirectory, uri);

        fs.exists(filename, function (exists) {
            if (!exists) {
                return callback(url, type, request, response);
            }

            if (fs.statSync(filename).isDirectory()) filename += '/index.html';

            fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                    return callback(url, type, request, response);
                }
                response.writeHead(200);
                response.write(file, "binary");
                response.end();
                return true;
            });
        });
    };
    this.add = function (routes, middlewares) {
        var that = this;
        var peekRoutes = function (type) {
            var insertRouteArray = (routes && (routes[type])) || {};
            for (var url in insertRouteArray) {
                if (insertRouteArray.hasOwnProperty(url) && typeof url === "string") {
                    var pattern = urlPattern.newPattern(url);
                    var callback = insertRouteArray[url];
                    that.callbacks[type][pattern.regex] = callback;
                    that.patterns[type][pattern.regex] = pattern;
                    that.middlewares[type][pattern.regex] = middlewares || [];
                }
            }
        };
        peekRoutes("GET");
        peekRoutes("POST");
        peekRoutes("PUT");
        peekRoutes("DELETE");
    };
    this.executeMiddlewares = function (req, res, middlewares) {
        if (middlewares) {
            if (Array.isArray(middlewares)) {
                var len = middlewares.length;
                for (var i = 0; i < len; i++)
                    middlewares[i](req, res);
            } else if (typeof(middlewares) == "function") {
                middlewares(req, res);
            }
        }
    };
    this.callRoute = function (url, type, req, res) {
        var that = this;
        this.staticDirectoryCallback(url, type, req, res, function (url, type, req, res) {
            var patterns = that.patterns[type] || [];
            var callbacks = that.callbacks[type] || [];
            var middlewares = that.middlewares[type] || [];

            for (var patternRegex in patterns)
                if (patterns.hasOwnProperty(patternRegex)) {
                    var pattern = patterns[patternRegex];
                    var callback = callbacks[patternRegex];
                    var middlewareList = middlewares[patternRegex];
                    var isMatch = pattern.match(url);
                    if (isMatch) {
                        that.executeMiddlewares(req, res, middlewareList);
                        callback(req, res, isMatch);
                        return;
                    }
                }
            that.notFound(res, res);
        });
    };
};

