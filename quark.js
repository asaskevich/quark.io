var http = require('http');
var colors = require('colors');
var Router = require('./router');
var jade = require('jade');
var route = require('./route');

module.exports = function (config) {
    this._init = function (config) {
        require('./injector')();
        if (typeof config === 'object')
            this._parseConfig(config || {});
        else if (typeof config === 'string') {
            var parsedConfig = require(config);
            this._parseConfig(parsedConfig);
        } else this._parseConfig({});

        global.quark = {
            _debugMode: this._debugMode,
            _logger: this._logger,
            _renderTemplate: this._renderTemplate,
            _renderFile: this._renderFile
        };
    };

    this._parseConfig = function (config) {
        this._port = config.port || 8888;
        this._debugMode = config.debug || false;
        this._statics = config.statics || [];
        this._logger = config.logger || console;
        this._renderTemplate = config.renderTemplate || jade.render;
        this._renderFile = config.renderFile || jade.renderFile;
        this._router = new Router(this._statics);
        this._404_handler = config["404"] || new route(["*", function (req, res) {
            res.send("404 - Not Found", 404);
        }]);
    };

    this.get = function () {
        var args = Array.prototype.slice.call(arguments);
        this._router._get.apply(this._router, args);
    };

    this.post = function () {
        var args = Array.prototype.slice.call(arguments);
        this._router._post.apply(this._router, args);
    };

    this.put = function () {
        var args = Array.prototype.slice.call(arguments);
        this._router._put.apply(this._router, args);
    };

    this.delete = function () {
        var args = Array.prototype.slice.call(arguments);
        this._router._delete.apply(this._router, args);
    };

    this.start = function () {
        var that = this;
        http.createServer(function (req, res) {
            global.quark._logger.info(req.method.cyan, req.url);
            global.quark._logger.time('\tTime'.cyan);
            try {
                if (!that._router._execute(req, res))
                    that._404_handler.execute(req, res);
            } catch (exception) {
                if (that._debugMode) global.quark._logger.error(exception.stack);
<<<<<<< HEAD
                res.fail('500 - Some errors on the server side:\n\n\t' +
=======
                res.fail('500 - some errors on the server side:\n\n\t' +
>>>>>>> 04bd30d32707925a23cecf43d525168511107032
                exception.stack + '\n\nException:\n\n\t' + exception);
            }
            global.quark._logger.timeEnd('\tTime'.cyan);
            global.quark._logger.info('\tResponse size:'.cyan, res.bodySize, 'bytes');
            global.quark._logger.info('\tStatus:'.cyan, res.statusCode);
        }).listen(this._port);
        global.quark._logger.log('Server started on port', (this._port + "").green, '\nWaiting for connections...');
        if (global.quark._debugMode) global.quark._logger.info('--- Debug Mode ---'.red);
    };

    this._init(config);
};