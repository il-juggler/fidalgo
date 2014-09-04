var express    = require('express');
var CLI 	   = FidalgoCLI.prototype;
var Site       = require('./site');

module.exports = FidalgoCLI;

function FidalgoCLI () {
	if(!(this instanceof FidalgoCLI)) return new FidalgoCLI();
	var cli = this, site, app;

	Object.defineProperty(cli,'site',{
		get : function () {
			site ||	(site = Site().CWD( process.cwd() ).loadConfig() );
			return site;
		}
	});

	Object.defineProperty(cli,'app',{
		get : function () {
			app ||	(app = express());
			return app;
		}
	});
}

CLI.exec = function (args) {
	if(!(args) || args.length == 0) {
		this.generate();
		this.serve();
		return
	} 
		
	this[args[0]]();
}

CLI.generate = function () {
	this.site.generate();
}


CLI.serve = function () {
	this.app.use(express.static(process.cwd() + '/site'));
	this.app.listen(4000);
}