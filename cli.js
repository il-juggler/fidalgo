var express    = require('express');
var cliProto   = FidalgoCLI.prototype;
var Site       = require('./site');
var utils      = require('./utils');
var fs         = require('fs');
var path       = require('path');

module.exports = FidalgoCLI;

function FidalgoCLI () {
	if(!(this instanceof FidalgoCLI)) return new FidalgoCLI();
	var cli = this, site, app;

	Object.defineProperty(cli,'site',{
		get : function () {
			if(!site) {
				site = Site()
						.CWD( process.cwd() )
						.loadConfig();
			}
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

cliProto.exec = function (args) {
	if(!(args) || args.length == 0) {
		this.generate();
		this.serve();
		return
	} 
		
	this[args[0]]();
}

cliProto.generate = function () {
	this.site.generate();
}


cliProto.serve = function () {
	this.app.use(express.static(process.cwd() + '/site'));
	this.app.listen(4000);
}


cliProto.init = function () {
	var src = path.resolve('src');
	var cfg = path.resolve('fidalgo.config.js');

	var src_src = path.join(__dirname, 'init', 'src');
	var cfg_src = path.join(__dirname, 'init', 'fidalgo.config.js');


	if(! fs.existsSync(cfg) ) {
		fs.writeFileSync(cfg, fs.readFileSync(cfg_src));
	} else {
		console.warn('Ya Existe un fidalgo.config, se usará');
	}

	if(fs.existsSync(src)) {
		console.error('El directorio existe :'.concat(src));
		console.error('Borrelo por su cuenta, después de respaldar');
		return;
	}

	utils.copyRecursiveSync(src_src, src);
	console.log('Archivos Copiados Exitosamente');
}