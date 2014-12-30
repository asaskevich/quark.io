var quark = require('quark.io');
var quark = new quark();

quark.get('/', function (req, res) {
    res.ok("Hello, World!");
});

quark.listen(3002);