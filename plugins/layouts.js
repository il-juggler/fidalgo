module.exports = LayoutsPlugin;

var path = require('path');
var utils = require('../utils');
var JADE = '.jade';
var fs = require('fs');

function LayoutsPlugin () {

	function initialize (site) {
		site.layouts    = {};
	}

	function loadLayouts (site) {
		var layoutsPath = path.resolve(site.cwd,site.src,'layouts');

		fs.readdirSync(layoutsPath).forEach(function(ly) {
			var lyPath = path.resolve(layoutsPath, ly),
				lyContents,
				lyName;

			if(path.extname(ly) == JADE) {
				lyContents  		 = fs.readFileSync(lyPath);
				lyName   		     = path.basename(ly,JADE);
				site.layouts[lyName] = utils.jade.compile(lyContents, {filename : lyPath});
			}
		});
	}


	return {
		name       : 'layouts',
		initialize : initialize,
		prepare    : loadLayouts
	}
}