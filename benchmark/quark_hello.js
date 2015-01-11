var quark = require('./../../quark.io');

var app = new quark({
    port: 3002
});

app.get('/', function(req, res) {
    res.send('Hello World!')
});

app.start();
