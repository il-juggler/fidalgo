var path       = require('path');
var marked     = require('marked');
var jade       = require('jade');

var generator = require('./generator');

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

var vConf = {
	md  : marked,
	cwd : process.cwd(),
	jade : jade, 
	dafaultLayout : 'layout'
};


var virtusFileFn = require(path.resolve(process.cwd(), 'virtusfile'));
virtusFileFn(vConf);

module.exports = generator(vConf);
