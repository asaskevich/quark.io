var quark = require('quark.io');
var quark = new quark();

quark.staticFiles("./public/");
quark.listen(3002);
