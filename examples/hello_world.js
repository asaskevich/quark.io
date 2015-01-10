var quark = require('quark.io');

var app = new quark({
    port: 3002,
    debug: true
});

app.get('/', function(req, res) {
    res.ok('Hello, World!')
});

app.start();
