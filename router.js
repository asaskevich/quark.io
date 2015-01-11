var route = require('./route');
var _url = require("url");
var path = require("path");
var fs = require("fs");

module.exports = function (staticsList) {
    this._routes = {
        GET: [],
        POST: [],
        PUT: [],
        DELETE: []
    };
    this._staticsList = staticsList || [];
    this._staticsListLen = this._staticsList.length;

    this._get = function () {
        if (global.quark._debugMode)
            global.quark._logger.info("Route GET:".cyan, arguments[0]);
        this._routes.GET.push(new route(arguments));
    };

    this._post = function () {
        if (global.quark._debugMode)
            global.quark._logger.info("Route POST:".cyan, arguments[0]);
        this._routes.POST.push(new route(arguments));
    };

    this._put = function () {
        if (global.quark._debugMode)
            global.quark._logger.info("Route PUT:".cyan, arguments[0]);
        this._routes.PUT.push(new route(arguments));
    };

    this._delete = function () {
        if (global.quark._debugMode)
            global.quark._logger.info("Route DELETE:".cyan, arguments[0]);
        this._routes.DELETE.push(new route(arguments));
    };

    this._serveStaticFiles = function (directory, request, response) {
        var uri = _url.parse(request.url).pathname;
        var filename = path.join(process.cwd() + path.sep + directory, uri);

        if (global.quark._debugMode) global.quark._logger.info('\tLooking for static file:'.cyan, filename);

        if (fs.existsSync(filename)) {
            if (fs.statSync(filename).isDirectory()) filename += '/index.html';
            if (!fs.existsSync(filename)) return false;
            fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                    return false
                }
                response.writeHead(200);
                response.write(file, "binary");
                response.end();
                return true;
            });
            return true;
        } else return false;
    };

    this._execute = function (req, res) {
        var _len, i;

        var _sDirs = this._staticsList;
        _len = this._staticsListLen;

        if (global.quark._debugMode) global.quark._logger.info('\tChecking statics...'.cyan);

        for (i = 0; i < _len; i++)
            if (this._serveStaticFiles(_sDirs[i], req, res)) return true;

        if (global.quark._debugMode) global.quark._logger.info('\tChecking routes...'.cyan);

        var _routes = this._routes[req.method];
        _len = _routes.length;
        for (i = 0; i < _len; i++)
            if (_routes[i].execute(req, res)) return true;

        if (global.quark._debugMode) global.quark._logger.info('\tNot found any static files or routes for this request!'.yellow);
        return false;
    };
};