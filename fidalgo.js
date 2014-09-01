#!/usr/bin/env node
var fGenerator = require('./index.js');
var FidalgoCLI = require('./cli.js');


var args = JSON.parse(JSON.stringify(process.argv));
args.shift();
args.shift();


var cli = new FidalgoCLI(fGenerator.d);
cli.exec.apply(cli,args);
