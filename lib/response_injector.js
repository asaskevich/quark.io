var jade = require('jade');
var sizeof = require('object-sizeof');
var colors = require('colors');

module.exports.inject = function (res) {
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
        console.log("\tStatus:".cyan, this.statusCode, "Size:".cyan, this.bodySize, "bytes");
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
    res.render = function (template, options, render) {
        render = jade.render || render;
        var html = render(template, options);
        res.html(html);
    };
    res.renderFile = function (file, options, render) {
        var renderFile = jade.renderFile || render;
        var html = renderFile(process.cwd() + "/" + file, options);
        res.html(html);
    };
    return res;
};
