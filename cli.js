var express    = require('express');
var app        = express();

var cli = FidalgoCLI.prototype;

module.exports = FidalgoCLI;

function FidalgoCLI (d) {
	this.d = d;
}

cli.exec = function() {
	if(arguments.length == 0) {
		this.generate();
		this.serve();
	} else {
		this[arguments[0]]();
	}
}


cli.generate = function() {
	this.d.generator();
}


cli.serve = function() {
	app.use(express.static(process.cwd() + '/site'));
	app.listen(4000);
}