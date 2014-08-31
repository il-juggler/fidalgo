#!/usr/bin/env node

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
	} else {
		this[arguments[0]]();
	}
}


FidalgoCLI.prototype.generate = function() {
	fGenerator();
}


FidalgoCLI.prototype.serve = function() {
	app.use(express.static(process.cwd() + '/site'));
	app.listen(4000);
}




var args = JSON.parse(JSON.stringify(process.argv));
args.shift();
args.shift();



var cli = new FidalgoCLI(fGenerator.d);
cli.exec.apply(cli, args);
