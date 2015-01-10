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

    this._get = function () {
        this._routes.GET.push(new route(arguments));
    };

    this._post = function () {
        this._routes.POST.push(new route(arguments));
    };

    this._put = function () {
        this._routes.PUT.push(new route(arguments));
    };

    this._delete = function () {
        this._routes.DELETE.push(new route(arguments));
    };

    this._serveStaticFiles = function (directory, request, response) {
        var uri = _url.parse(request.url).pathname;
        var filename = path.join(process.cwd() + path.sep + directory, uri);

        if (global.quark._debugMode) global.quark._logger.info('\tLooking for static file:'.cyan, filename);

        if (fs.existsSync(filename)) {
<<<<<<< HEAD

            if (fs.statSync(filename).isDirectory()) filename += '/index.html';

=======
            if (fs.statSync(filename).isDirectory()) filename += '/index.html';
            if (!fs.existsSync(filename)) return false;
>>>>>>> 04bd30d32707925a23cecf43d525168511107032
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
        var _sDirs = this._staticsList;
        var _len = _sDirs.length;

        if (global.quark._debugMode) global.quark._logger.info('\tChecking statics...'.cyan);

        for (var i = 0; i < _len; i++)
            if (this._serveStaticFiles(_sDirs[i], req, res)) return true;

        if (global.quark._debugMode) global.quark._logger.info('\tChecking routes...'.cyan);

        var _routes = this._routes[req.method] || [];
        var _len = _routes.length;
        for (var i = 0; i < _len; i++)
            if (_routes[i].execute(req, res)) return true;

        if (global.quark._debugMode) global.quark._logger.info('\tNot found any static files or routes for this request!'.yellow);
        return false;
    };
};