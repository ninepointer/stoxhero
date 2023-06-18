var ta = require('./textAlign');
var d = require('./display');
var fw = require('./fontWeight');
var ff = require('./fontFamily');
var fs = require('./fontSize');
var m = require('./margin');
var p = require('./padding');
var textTruncate = require('./textTruncate');
var flag = require('./flag');

var modules = {
	textTruncate: textTruncate,
	flag: flag
}

module.exports = { 
    ta: ta,
    d: d,
    fw: fw,
    ff: ff,
    fs: fs,
    m: m,
    p: p,
	modules: modules
 }
