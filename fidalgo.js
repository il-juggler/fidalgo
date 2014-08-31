var express    = require('express');
var app        = express();
var fGenerator = require('./index.js');


function FidalgoCLI (d) {
	this.d = d;
}


FidalgoCLI.prototype.exec = function() {
	if(arguments.length == 0) {
		this.generate();
		this.serve();
	}
}


FidalgoCLI.prototype.generate = function() {
	fGenerator();
}


FidalgoCLI.prototype.serve = function() {
	app.use(express.static(process.cwd() + '/site'));
	app.listen(4000);
}


var cli = new FidalgoCLI(fGenerator.d);
cli.exec();
