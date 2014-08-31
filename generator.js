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

	var stylesPath = path.resolve(d.out, 'styles');

	if( ! fs.existsSync(stylesPath) ) {
		fs.mkdirSync(stylesPath);
	}
}


function doGenerate (d) {
	generatePages(d);
	generateCss(d);
}

function generatePages(d) {
	d.pages.forEach(function(page) {
		var locals    = object_extend({site : d}, page);
		var layoutFn  = page.layout;

		layoutFn = (layoutFn) ? d.layouts[layoutFn] : d.layouts[d.defaultLayout];
		fs.writeFileSync(page.settings.file, layoutFn(locals) );
	});
}


function generateCss(d) {
	var pathStyle = path.resolve(d.cwd, d.src, 'styles/style.stylus');
	var stContents;
	var outPath = path.resolve(d.out, 'styles/style.css');

	if(fs.existsSync(pathStyle)){
		

		stContents = fs.readFileSync(pathStyle).toString();


		d.stylus.render(stContents, { filename: 'style.css' }, function(err, res) {

			err && console.log(err);
			console.log(res);


			
			if(!err){
				
				fs.writeFileSync(outPath, res);
			}
		});
	} 
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
			content = d.md(fileContents);

			var dataPath = path.resolve(_postPath, path.basename(filePath, MD) + '.json');
			
			if( fs.existsSync(dataPath) ) {
				data = require(dataPath);
			} else {
				data = {};
			}


			

			var fullOutPathFile = path.resolve(
				outPath, 
				path.basename(filePath,MD).concat(HTML)
			);

			var inheritedData = {};

			var page = object_extend(
				{},
				inheritedData,
				data,
			 	{
					uri :'/', content : content
				}
			);

			var locals = object_extend(
				{
					page :     page,
					settings : {file : fullOutPathFile}
				}  
			);

			d.pages.push(locals);
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