var urlPattern = require('url-pattern');

module.exports = function () {
    var args = Array.prototype.slice.call(arguments[0]);
    this._url = urlPattern.newPattern(args[0]);
    this._callback = args[1];
    this._middlewareList = args.slice(2);
    this._middlewareListLen = this._middlewareList.length;
    this.paramNames = this._callback.toString()
        .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, '')
        .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
        .split(/,/).slice(2);
    this.paramNamesLen = this.paramNames.length;
    this._cachedURL = [];

    this._extractArgs = function (req, res, params) {
        var args = [req, res];
        var len = this.paramNamesLen;
        for (var i = 0; i < len; i++) {
            args.push(params[this.paramNames[i]] || "");
        }
        return args;
    };

    this._match = function (route) {
        return this._cachedURL[route] || this._url.match(route);
    };

    this.execute = function (req, res) {
        var params = this._match(req.url);
        if (params) {
            this._cachedURL[req.url] = params;
            var args = this._extractArgs(req, res, params);
            if (global.quark._debugMode) global.quark._logger.info('\tRoute args:'.cyan, params);

            var _len = this._middlewareListLen;
            for (var i = 0; i < _len; i++) {
                var currentMiddleware = this._middlewareList[i];
                currentMiddleware.apply(this, args);
            }
            this._callback.apply(this, args);
            return true;
        } else return false;
    };
};
