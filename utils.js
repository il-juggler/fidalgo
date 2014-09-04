
var marked     = require('marked');
var jade       = require('jade');
var stylus     = require('stylus');
var fs         = require('fs');
var path       = require('path');


marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});


function deleteFolderRecursive (path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}


/**
 * Look ma, it's cp -R.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
var copyRecursiveSync = function(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.linkSync(src, dest);
  }
};


function mkDirIfNotExists (dirPath) {
	fs.existsSync(dirPath) || fs.mkdirSync(dirPath);
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




module.exports = {
	md   : marked,
	jade : jade,
	stylus : stylus, 
	copyRecursiveSync : copyRecursiveSync,
	deleteFolderRecursive : deleteFolderRecursive,
	mkDirIfNotExists : mkDirIfNotExists,
  extend : object_extend
};