module.exports = StaticPlugin;

var utils = require('../utils');
var path  = require('path');

function StaticPlugin () {

	/**
	 * Borrar el path de salida
	 */
	function deleteOutFolder (site) {
		utils.deleteFolderRecursive( path.resolve(site.cwd, site.out) );
	}

	/** 
	 * Copiar Carpeta 
	 */
	function createOutFolderFromStatic (site) {
		var staticFolder = path.resolve(site.cwd, site.src, 'static'),
		    outFolder    = path.resolve(site.cwd, site.out);
		    
		utils.copyRecursiveSync(staticFolder, outFolder);
	}

	return {
		initialize : deleteOutFolder,
		prepare    : createOutFolderFromStatic,
		name : 'Static'
	};
}

