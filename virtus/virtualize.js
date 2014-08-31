module.exports = Virtualize;

var fs = require('fs');
var path = require('path');

var JADE = '.jade';
var MD   = '.md';
var HTML = '.html';


function Virtualize (d) {
	//Leer la carpeta de posts
	var _postPath    = path.resolve(d.cwd, d.src, 'posts');
	var outPath      = path.resolve(d.cwd, d.out);

	readMainConfig(d);

	readLayouts(d);
	readPages(d);

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
				content = d.md(fileContents);
			}

		
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


			fs.writeFileSync(fullOutPathFile, d.layouts[locals.page.layout](locals) );
		}
	});
}


function readLayouts(d) {
	d.layouts = {};

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