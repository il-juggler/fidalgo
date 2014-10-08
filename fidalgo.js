#!/usr/bin/env node
var FidalgoCLI = require('./cli.js');


var cli = new FidalgoCLI();
cli.exec.call(cli, getArguments());

function getArguments() {
	var args = JSON.parse(JSON.stringify(process.argv));
	args.shift();
	args.shift();
	return args;
}