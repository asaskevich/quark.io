var http = require('http');
var sizeof = require('object-sizeof');

module.exports = function () {
    var res = http.OutgoingMessage.prototype;

    res._end = res.end;
    res._write = res.write;
    res.bodySize = 0;
    res.write = function (chunk, encoding) {
        this.bodySize += sizeof(chunk || "");
        this._write(chunk || "", encoding);
    };
    res.end = function (data, encoding) {
        if (this.alreadySent) throw new Error("Response already sent!");
        this._end(data, encoding);
        this.alreadySent = true;
    };
    res.send = function (data, code, headers) {
        code = code || 200;
        headers = headers || {};
        this.writeHead(code, headers);
        this.write(data);
        this.end();
    };
    res.fail = function (data, headers) {
        this.send(data, 500, headers);
    };
    res.ok = function (data, headers) {
        this.send(data, 200, headers);
    };
    res.redirect = function (data, redirectUrl, headers) {
        var _headers = headers || {};
        _headers.Location = redirectUrl || "/";
        this.send(data, 302, _headers);
    };
    res.text = function (data, headers) {
        var _headers = headers || {};
        _headers["Content-Type"] = "text/plain";
        this.send(data, 200, _headers);
    };
    res.html = function (data, headers) {
        var _headers = headers || {};
        _headers["Content-Type"] = "text/html";
        this.send(data, 200, _headers);
    };
    res.json = function (data, headers) {
        var _headers = headers || {};
        _headers["Content-Type"] = "text/json";
        this.send(JSON.stringify(data), 200, _headers);
    };
    res.render = function (template, options) {
        render = global.quark._renderTemplate;
        var html = render(template, options);
        res.html(html);
    };
    res.renderFile = function (file, options) {
        var renderFile = global.quark._renderFile;
        if (global.quark._debugMode) global.quark._logger.info('\tRendering file:', process.cwd() + "/" + file);
        var html = renderFile(process.cwd() + "/" + file, options);
        res.html(html);
    };
};