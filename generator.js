module.exports = Generator;

var fs = require('fs');
var path = require('path');

var JADE = '.jade';
var MD   = '.md';
var HTML = '.html';
var STYL = '.stylus';

function Generator (site) {
	
	function generate () {
		initialize(site);
		loadLayouts(site);
		loadPages(site);
		doGenerate(site);
	}

	site.generator  = generate;
	generate.d      = site;
	generate.site   = site;

	return generate;
}



function initialize (site) {
	site.layouts    = {};
	site.pages      = [];
	site.categories = [];

	var stylesPath = path.resolve(site.out,'styles');
	mkDirIfNotExists(stylesPath);
}


function doGenerate (site) {
	generatePages(site);
	generateCss(site);
}

function generatePages(site) {
	site.pages.forEach(function(p) {
		var locals  = object_extend({site : site}, p);
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
			mkDirIfNotExists(folderPath);
		});

		fs.writeFileSync(fullPagePath, data);
	}
}


function generateCss (site) {
	var pathStyle = path.resolve(site.cwd, site.src, 'styles/style.stylus'),
		outPath   = path.resolve(site.cwd, site.out, 'styles/style.css'),
		stContents;

	if(fs.existsSync(pathStyle)){
		stContents = fs.readFileSync(pathStyle).toString();
		site.stylus.render(stContents, {filename: 'style.css'}, function(err, res) {
			if(!err){				
				fs.writeFileSync(outPath, res);
			} else {
				console.log(err);	
			}
		});
	} 
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
			site.layouts[lyName] = site.jade.compile(lyContents, {filename : lyPath});
		}
	});
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
			} else if(path.extname(fileInSubPath) == MD) {
				loadPage(subPath, fileInSubPath);
			}
		});
	}


	function loadPage(subPath, file) {
		var pageFilePath = path.resolve(pagesPath,subPath,file);	
		var fileRawName  = path.basename(file, MD);

		var fileContents = fs.readFileSync(pageFilePath).toString();
		var pageData     = getPageData(subPath, fileRawName);
		var content      = site.md(fileContents); 


		// page {fileContents: ---, data ---, content} 

		
		if(subPath == '' && fileRawName == 'index') {
			uri = '';
		} else {
			uri = path.join(subPath,fileRawName);
		}

		var outFileName = path.join(uri, 'index.html');

		uri = '/'.concat(uri);

		var lPageData = object_extend(
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



/* --- UTILS --- */

function object_extend () {
	var args =  Array.prototype.slice.call(arguments);
	var obj = args.shift();

	args.forEach(function(o) {
		Object.keys(o).forEach(function(k) {
			obj[k] = o[k];
		});
	});

	return obj;
} 

function mkDirIfNotExists (dirPath) {
	fs.existsSync(dirPath) || fs.mkdirSync(dirPath);
}