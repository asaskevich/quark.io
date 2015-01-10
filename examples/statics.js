var quark = require('quark.io');

var app = new quark({
    port: 3002,
    debug: true,
    statics: ["../examples", "../node_modules"]
});

app.start();