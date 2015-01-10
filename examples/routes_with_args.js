var quark = require('quark.io');

var app = new quark({
    port: 3002,
    debug: true
});

app.get('/user/:id', function(req, res, id) {
    res.json({
        id: id,
        username: 'User ' + id
    });
});

app.start();