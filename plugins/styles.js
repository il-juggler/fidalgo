module.exports = StylesPlugin;

var utils = require('../utils');
var fs    = require('fs');
var path  = require('path');


function StylesPlugin () {
	
	function createStylesOutFolder (site) {
		var stylesPath = path.resolve(site.cwd, site.out,'styles');
		utils.mkDirIfNotExists(stylesPath);
	}

	function generateCss (site) {
		var pathStyle = path.resolve(site.cwd, site.src, 'styles/style.stylus'),
		    outPath   = path.resolve(site.cwd, site.out, 'styles/style.css'),
		    stContents;

		if(fs.existsSync(pathStyle)){
			stContents = fs.readFileSync(pathStyle).toString();
			utils.stylus.render(stContents, {filename: 'style.css'}, function(err, res) {
				if(!err){				
					fs.writeFileSync(outPath, res);
				} else {
					console.log(err);	
				}
			});
		} 
	}

	return {
		name : 'styles',
		prepare : createStylesOutFolder,
		execute : generateCss
	}
}