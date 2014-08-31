module.exports = Generator;

var fs = require('fs');
var path = require('path');

var JADE = '.jade';
var MD   = '.md';
var HTML = '.html';
var STYL = '.stylus';

function Generator (d) {
	
	function generate () {
		initialize(d);
		loadLayouts(d);
		loadPages(d);
		doGenerate(d);
	}

	d.genearator = generate;
	generate.d   =  d;

	return generate;
}



function initialize (d) {
	d.layouts    = {};
	d.pages      = [];
	d.categories = [];
}



function doGenerate (d) {
	d.pages.forEach(function(page) {
		
		var locals = object_extend({site : d}, page.locals);
		var layoutFn  = page.locals.layout;
		layoutFn = (layoutFn) ? d.layouts[layoutFn] : d.layouts[d.defaultLayout];

		fs.writeFileSync(page.file, layoutFn(page.locals) );
	});
}


function loadLayouts (d) {

	var _layoutsPath = path.resolve(d.cwd, d.src, 'layouts');

	fs.readdirSync(_layoutsPath).forEach(function(ly) {
		var fullLayoutPath = path.resolve(_layoutsPath, ly),
			fileContents,
			layoutName;

		if(path.extname(ly) == JADE) {
			fileContents  		  = fs.readFileSync(fullLayoutPath);
			layoutName   		  = path.basename(ly, JADE);
			d.layouts[layoutName] = d.jade.compile(fileContents);
		}
	});
}

function loadPages (d) {
	var _postPath    = path.resolve(d.cwd, d.src, 'pages');
	var outPath      = path.resolve(d.cwd, d.out);

	//Este lee los posts y los crea
	fs.readdirSync(_postPath).forEach(function(filePath) {
		var fullFilePath = path.resolve(_postPath, filePath);

		if(path.extname(filePath) == MD) {
			var fileContents = fs.readFileSync(fullFilePath).toString();
			var data, content;
			var split = fileContents.split( /\n\-{3,6}\n/);

			if(split.length == 3) {
				data    = JSON.parse( split[1] );
				content = split[2]; 
			} else {
				data    = {};
				content = fileContents;
			}

			content = d.md(content);

			var fullOutPathFile = path.resolve(
				outPath, 
				path.basename(filePath,MD).concat(HTML)
			);

			var inheritedData = {};

			var locals = object_extend(
				{layout : 'layout'}, 	//El básico solo pone layout por si no hay 
				inheritedData,    		//inheritedData
				data,             		//data
				{
					page : {uri :'/', content : content}
				}  
			);

			d.pages.push({
				file    : fullOutPathFile,
				locals  : locals
			});
		}
	});
}

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