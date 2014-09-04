
module.exports = PagesPlugin;

var fs = require('fs');
var path = require('path');
var MD = '.md';
var JSON = '.json';

var utils = require('../utils');


function PagesPlugin () {

	function initialize (site) {
		site.pages      = [];
		site.categories = [];
	}

	function loadPages (site) {
		var pagesPath    = path.resolve(site.cwd, site.src, 'pages');
		var outPath      = path.resolve(site.cwd, site.out);

		loadPageFolder('');

		function loadPageFolder(subPath) {
			var fullSubPath = path.resolve(pagesPath, subPath);

			fs.readdirSync(fullSubPath).forEach(function(fileInSubPath) {
				var filePath = path.resolve(fullSubPath, fileInSubPath);
				var fileInfo = fs.statSync(filePath);

				if(fileInfo.isDirectory()) {
					loadPageFolder(path.join(subPath, fileInSubPath));
					return;
				}

				if(path.extname(fileInSubPath) == MD) {
					loadPage(subPath, fileInSubPath);
				}
			});
		}


		function loadPage(subPath, file) {
			var pageFilePath = path.resolve(pagesPath,subPath,file);	
			var fileRawName  = path.basename(file, MD);

			var fileContents = fs.readFileSync(pageFilePath).toString();
			var pageData     = getPageData(subPath, fileRawName);
			var content      = utils.md(fileContents); 

			// page {fileContents: ---, data ---, content} 

			if(subPath == '' && fileRawName == 'index') {
				uri = '';
			} else {
				uri = path.join(subPath,fileRawName);
			}

			var outFileName = path.join(uri, 'index.html');

			uri = '/'.concat(uri);

			var lPageData = utils.extend(
				{title : fileRawName},
				pageData, 
				{uri : uri , content : content}
			);


			site.pages.push({
				page     : lPageData,
				settings : {
					uri  : uri,
					file : outFileName
				}
			});
		}

		function getPageData (subPath, fileRawName) {
			var dataFilePath = path.resolve(pagesPath,subPath,fileRawName + '.json');

			if(fs.existsSync(dataFilePath)) {
				return require(dataFilePath);
			}
			return {};
		}
	}

	function generatePages(site) {

		site.pages.forEach(function(p) {
			var locals  = utils.extend({site : site}, p);
			var layout  = getLayout(p);
			console.log('\x1B[34m' + locals.page.uri + '\x1B[39m')
			writePage(p.settings.file, layout(locals));
		});

		function getLayout (p) {
			var ly = (p.page.layout) ? p.page.layout : site.defaultLayout;
			return site.layouts[ly];
		}

		function writePage (file,data) {
			var fullPagePath = path.resolve(site.cwd,site.out,file);
			var relPath = '';

			path.dirname(file).split(path.sep).forEach(function(sub) {
				relPath = path.join(relPath, sub);
				var folderPath = path.resolve(site.cwd,site.out,relPath);
				utils.mkDirIfNotExists(folderPath);
			});

			fs.writeFileSync(fullPagePath, data);
		}
	}


	return {
		name       : 'pages',
		initialize : initialize,
		prepare    : loadPages, 
		execute    : generatePages
	}
}